import { Injectable } from '@nestjs/common';
import { AgendaService } from 'src/modules/common/agenda/agenda.service';
import { SetDeatailsDto } from './dto/doctor.dto';
import { AlsService } from 'src/modules/common/als/als.service';
import { HelperService } from 'src/modules/common/helpers/helper.service';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor, DoctorDocument } from './schema/doctor-schema';
import { Model } from 'mongoose';
import { DoctorModule } from './doctor.module';
import { Availablalitytype } from './type';
import Agenda from 'agenda';

@Injectable()
export class DoctorService {
  constructor(
    private agendaService: AgendaService,
    private readonly als: AlsService,
    private readonly helperService: HelperService,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
  ) {}

  public async setCriteria(body: SetDeatailsDto[]) {
    console.log('object---->', this.als.getUserId(), body);
    const session = await this.doctorModel.startSession();
    try {
      session.startTransaction();
      const doctor = await this.doctorModel.findById<DoctorDocument>(
        this.als.getUserId(),
      );
      console.log(doctor);
      if (!doctor) {
        throw new Error(' could not find the doctor');
      }
      for (const item of body) {
        const scheduledTime = this.helperService.dayTimeManagment(
          item.day,
          item.end,
        );
        const startTimeISO = this.helperService
          .convertToISOTime(item.start)
          ?.slice(11, -4);
        const endTimeISO = this.helperService
          .convertToISOTime(item.end)
          ?.slice(11, -4);

        const isOverlapping = doctor.availability.some((status) => {
          return (
            status.day === item.day &&
            ((startTimeISO >= status.start && startTimeISO <= status.end) ||
              (endTimeISO >= status.start && endTimeISO <= status.end))
          );
        });
        console.log(item);
        if (!isOverlapping) {
          const createEntry = await this.doctorModel.findByIdAndUpdate(
            doctor.id,
            {
              $push: {
                availability: {
                  day: item.day,
                  start: startTimeISO,
                  end: endTimeISO,
                  date: scheduledTime.date,
                  available: true,
                },
              },
              $set: { Max: item.HowManyPatients },
            },
            { new: true, session },
          );

          const matchingAvailability = createEntry?.availability.find(
            (availability) => availability.day === item.day,
          );

          if (!matchingAvailability) {
            throw new Error('no matching Availability found');
          }

          const agenda = this.agendaService.getAgenda();
          await agenda?.schedule(
            scheduledTime.targetDateTime,
            'remove expired availability',
            {
              doctorId: doctor._id,
              objectId: matchingAvailability._id,
            },
          );
        }
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof Error) {
        throw new Error(`error occurred:${error.message}`);
      }
    } finally {
      await session.endSession();
    }
  }
}
