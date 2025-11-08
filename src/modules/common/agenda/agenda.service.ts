import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Agenda, Job } from 'agenda';
import moment from 'moment';
import mongoose, { Model } from 'mongoose';
import {
  Doctor,
  DoctorDocument,
} from 'src/modules/core/doctor/schema/doctor-schema';
import { User, UserDocument } from 'src/modules/core/user/schema/user-schema';
import { HelperService } from '../helpers/helper.service';
import {
  Appointment,
  AppointmentDocument,
} from 'src/modules/core/appointment/schema/appointment';

@Injectable()
export class AgendaService implements OnModuleInit, OnModuleDestroy {
  private agenda: Agenda;
  private now;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
    private readonly helperService: HelperService,
  ) {
    this.agenda = new Agenda({
      db: {
        address:
          process.env.MONGO_URI ||
          'mongodb+srv://cleverbooksai:7qhuC0wD3CK4VCwG@cb-backend-staging.le9yv4w.mongodb.net/mediconnect',
      },
      maxConcurrency: 4,
    });

    this.agenda.on('start', (job: Job) =>
      console.log(
        `Job ${job.attrs.name} starting at ${new Date().toISOString()}`,
      ),
    );

    this.agenda.on('complete', (job: Job) =>
      console.log(
        `Job ${job.attrs.name} finished at ${new Date().toISOString()}`,
      ),
    );

    this.agenda.on('fail', (err, job: Job) =>
      console.error(
        `Job ${job.attrs.name} failed at ${new Date().toISOString()}`,
        err,
      ),
    );

    this.now = moment();
  }

  async onModuleInit() {
    this.defineJobs();
    try {
      await this.agenda.start();
      console.log('Agenda started successfully');
    } catch (error) {
      console.error('Failed to start Agenda:', error);
    }
  }
  async onModuleDestroy() {
    try {
      await this.agenda.stop();
      console.log('Agenda started successfully');
    } catch (error) {
      console.error('Failed to start Agenda:', error);
    }
  }

  public defineJobs() {
    this.agenda.define(
      'remove expired availability',
      async (job: { attrs: { data: { doctorId: string } } }) => {
        const collect_expire_dates = [];
        const update_data: string[] = [];
        const collect_endinfTime = [];
        const collectIdofobjects = [];
        const current_date_patient_filter = [];
        const { doctorId } = job.attrs.data;
        if (doctorId) {
          console.log('test1-passed', doctorId);
        } else {
          console.log('test1-failed');
          throw new Error('could not find the doctorid');
        }

        const doctor =
          await this.doctorModel.findById<DoctorDocument>(doctorId);
        if (doctor) {
          console.log('test2-passed');
        } else {
          console.log('test2-failed');
          throw new Error(`doctor with ${doctorId} not found`);
        }

        const { availability } = doctor;
        if (availability.length > 0 && availability) {
          console.log('test3-passed');
        } else {
          console.log('test3-failed');
          throw new Error(`doctor with ${doctorId} availability not found`);
        }

        for (let i = 0; i <= availability.length - 1; i++) {
          const availabilityDate = availability[i].date;
          if (!availabilityDate) {
            console.log(moment(availabilityDate, 'MM-DD-YYYY'));
          }
          if (moment(availabilityDate).isBefore(this.now)) {
            let isAfterAll = true;
            for (let j = 0; j < availability?.length; j++) {
              if (
                i !== j &&
                moment(availabilityDate, 'MM-DD-YYYY').isAfter(this.now)
              ) {
                isAfterAll = false;
                break;
              }
            }
            if (isAfterAll) {
              update_data.push(availability[i]?.day);
              collect_expire_dates.push(availability[i]?.date);
              collect_endinfTime.push(availability[i]?.end);
              collectIdofobjects.push(availability[i]?._id);
            }
          }
        }

        const nextDate = this.helperService.updateAvailabilityDates(
          update_data,
          collect_endinfTime,
        );
        if (nextDate) {
          console.log('test4->passed');
        } else {
          console.log('test4->failed');
          throw new Error('no next date');
        }

        for (let i = 0; i < update_data?.length; i++) {
          if (doctor?.id) {
            await this.doctorModel.findByIdAndUpdate(
              doctor.id,
              {
                $set: {
                  'availability.$[elem].date': nextDate[i].date,
                  'availability.$[elem].laterNumber': { number: 0 },
                },
              },
              {
                arrayFilters: [{ 'elem.day': update_data[i] }],
                new: true,
              },
            );
          } else {
            throw new Error('could not update');
          }
          // Agenda stores the underlying MongoDB database object as `_mdb`
          const db = this.agenda['_mdb'];

          // Access the collection directly
          const job = await db.collection('agendaJobs').findOne({
            'data.objectId': String(collectIdofobjects[i]),
          });
          if (job && job.nextRunAt === null) {
            await db
              .collection('agendaJobs')
              .updateOne(
                { 'data.objectId': String(collectIdofobjects[i]) },
                { $set: { nextRunAt: new Date(nextDate[i].reAgetedTime) } },
              );
          } else if (job) {
            await db
              .collection('agendaJobs')
              .updateOne(
                { 'data.objectId': String(collectIdofobjects[i]) },
                { $set: { nextRunAt: new Date(nextDate[i].reAgetedTime) } },
              );
          }
        }

        const fetchPatientId =
          await this.appointmentModel.find<AppointmentDocument>({
            doctor: doctor?.id,
          });
        if (fetchPatientId) {
          console.log('test5->passed');
        } else {
          console.log('test5->failed');
          throw new Error('could not update');
        }

        for (let i = 0; i < fetchPatientId?.length; i++) {
          for (let j = 0; j < collect_expire_dates?.length; j++) {
            if (
              fetchPatientId[i].Appointments[0].date === collect_expire_dates[j]
            ) {
              current_date_patient_filter.push(fetchPatientId[i]);
            }
          }
        }

        if (current_date_patient_filter.length > 0) {
          let delete_patient_appointment;
          let fetchPatient;
          let unset_Appointmentstatus_of_patient;

          for (let i = 0; i < current_date_patient_filter.length; i++) {
            delete_patient_appointment =
              await this.appointmentModel.findByIdAndDelete(
                current_date_patient_filter[i]._id,
              );
          }

          if (delete_patient_appointment) {
            console.log('test6->passed');
            //10
            for (let i = 0; i <= fetchPatientId.length - 1; i++) {
              fetchPatient = await this.userModel.findById<UserDocument>(
                current_date_patient_filter[i].patient.toString(),
              );
              for (let j = 0; j <= collect_expire_dates.length - 1; j++) {
                unset_Appointmentstatus_of_patient =
                  await this.userModel.findByIdAndUpdate(fetchPatient?.id, {
                    $pull: {
                      appointmentStatus: {
                        patient: {
                          $elemMatch: {
                            date: { $in: collect_expire_dates[j] },
                          },
                        },
                      },
                    },
                  });
              }
            }

            if (fetchPatient && unset_Appointmentstatus_of_patient) {
              console.log('text7->passed');
            } else {
              console.log('text7->failed');
              throw new Error(
                'could not find the patient with the provided id',
              );
            }
          }
        }
      },
    );
  }

  public getAgenda() {
    try {
      return this.agenda;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      }
    }
  }
}
