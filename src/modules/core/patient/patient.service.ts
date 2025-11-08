import { Injectable } from '@nestjs/common';
import {
  ApplyFilterDto,
  BookAppointmentManuallyDto,
  CancleAppointmentDto,
  FetchAllDoctors,
  searchAsYouTypeDto,
} from './dto/patient.schema';
import { AlsService } from 'src/modules/common/als/als.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schema/user-schema';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from '../doctor/schema/doctor-schema';
import { HelperService } from 'src/modules/common/helpers/helper.service';
import moment from 'moment';
import { Appointment } from '../appointment/schema/appointment';
import { RedisHashFunctionService } from 'src/modules/common/redis/redisHashFunction.service';
import { RedisCachingService } from 'src/modules/common/redis/redisCaching.service';
import { SuccessResponse } from 'src/common/utils/custom-response';

@Injectable()
export class PatientService {
  constructor(
    private als: AlsService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
    private readonly helperService: HelperService,
    private readonly redisHashFunctionService: RedisHashFunctionService,
    private readonly redisCachingService: RedisCachingService,
  ) {}

  private async check(
    id: string,
    Day: string,
  ): Promise<{
    success?: boolean;
    findDoctor?: DoctorDocument;
    currentNumber?: number;
    message?: string;
  }> {
    try {
      if (id === undefined || !id) {
        return {
          success: false,
          message: 'id unavailable',
        };
      }
      const findDoctor = await this.doctorModel.findById<DoctorDocument>(id);
      if (findDoctor) {
        console.log('test1->passed');
      } else {
        console.log('test1->failed exiting Verify authority');
        return {
          success: false,
          message: 'could not find the doctor',
        };
      }

      const { availability } = findDoctor;
      if (Array.isArray(availability) && availability.length > 0) {
        console.log('test2->passed');
      } else {
        console.log('test2->failed');
        return {
          success: false,
          message: 'availability array error',
        };
      }

      const dayExists = availability.find((status) => {
        return status.day === Day.toLowerCase();
      });
      if (dayExists === undefined) {
        console.log('test3->failed');
        return {
          success: false,
          message: 'doctor is not available on that day',
        };
      } else {
        console.log('test3->passed');
      }

      const now = this.helperService.currentTime();
      const endTime = this.helperService.createTime(dayExists.end);
      const startTime = this.helperService.createTime(dayExists.start);
      if (
        moment(now).isBefore(moment(startTime)) ||
        moment(now).isAfter(endTime)
      ) {
        return {
          success: false,
          message: 'clinic is not open yet',
        };
      }

      if (findDoctor.Max <= dayExists.laterNumber.number) {
        return {
          success: false,
          message: 'Doctor currently is not taking patients ',
        };
      }
      return {
        success: true,
        findDoctor: findDoctor,
        currentNumber: dayExists.laterNumber.number,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      return error.message;
    }
  }
  public async fetchAllDoctors(body: FetchAllDoctors) {
    console.log(body);
    const doctors = await this.doctorModel
      .find(!body.lastId ? { role: 'doctor' } : { _id: { $gt: body.lastId } })
      .sort({ _id: 1 })
      .limit(10);
    if (!Array.isArray(Doctor) && doctors.length === 0) {
      return {
        message: 'no doctor available',
        data: [],
      };
    }

    if (
      await this.redisHashFunctionService.hExists_setExtra_details(
        this.als.getUserId(),
        String(body.lastIdKey),
      )
    ) {
      await this.redisHashFunctionService.hDelete_setExtra_details(
        this.als.getUserId(),
        String(body.lastIdKey),
      );

      const data = await this.redisHashFunctionService.hGet_hashed_data(
        this.als.getUserId(),
        String(body.lastIdKey),
      );
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('data is not an array');
      }

      const newarr = [...data, ...doctors];
      await this.redisCachingService.setCahe(
        String(body.redisKey),
        newarr,
        this.als.getUserId(),
      );

      const lastDocID = doctors[doctors.length - 1]._id?.toString();
      await this.redisCachingService.setExtra_details({
        detail: 'save_last_id',
        id: this.als.getUserId(),
        redisKey: body.redisKey,
        data: lastDocID,
      });
    } else {
      await this.redisCachingService.setCahe(
        String(body.redisKey),
        doctors,
        this.als.getUserId(),
      );
      if (doctors.length > 0) {
        const lastDocID = doctors[doctors.length - 1]._id?.toString();
        await this.redisCachingService.setExtra_details({
          detail: 'save_last_id',
          id: this.als.getUserId(),
          redisKey: body.lastIdKey,
          data: lastDocID,
        });
      }
    }

    return SuccessResponse('doctors fetched successfully', doctors);
  }

  public async bookAppointment(docid: string) {
    console.log(docid);
    console.log(this.als.getUserId(), this.als.getRole());
    const session = await this.userModel.startSession();
    try {
      session.startTransaction();
      const patient = await this.userModel.findById<UserDocument>(
        this.als.getUserId(),
      );
      if (patient) {
        console.log('test1-passed');
      } else {
        console.log('test1-failed');
        throw new Error('patient not found');
      }

      const currentDay = this.helperService.createCurrentDay();
      if (currentDay && typeof currentDay === 'string') {
        console.log('test2->passed');
      } else {
        throw new Error('patient not found');
      }

      const date = this.helperService.dayTimeManagment(currentDay);
      if (date && typeof date === 'object') {
        console.log('test3->passed');
      } else {
        console.log('test3->failed');
        throw new Error('dayTimeManagment function failed');
      }

      const authorityCheck = await this.check(docid, currentDay);
      if (typeof authorityCheck === 'object' && authorityCheck.success) {
        console.log('test4->passed');
      } else {
        console.log('test4->failed');
        return {
          success: false,
          message: authorityCheck.message,
        };
      }

      const Time = date?.targetDateTime.slice(15);
      const doctorData = authorityCheck.findDoctor;
      const number = authorityCheck.currentNumber;
      const updateDocAvailability = await this.doctorModel.findByIdAndUpdate(
        doctorData?.id,
        {
          $inc: { 'availability.$[elem].laterNumber.number': 1 },
        },
        {
          arrayFilters: [{ 'elem.day': currentDay }],
          new: true,
          session: session,
        },
      );
      if (updateDocAvailability) {
        console.log('test4->passed');
      } else {
        console.log('test4->failed');
        return {
          success: false,
          message: 'could not updte ',
        };
      }

      console.log(updateDocAvailability?.availability);

      const getcurrentDayNumebr = updateDocAvailability?.availability.find(
        (index) => {
          return index?.day === currentDay;
        },
      );
      if (getcurrentDayNumebr !== undefined) {
        console.log('test8->passed');
      } else {
        console.log('test8->failed');
        return {
          success: false,
          message: 'could not retrieve the number from the updated doc',
        };
      }

      const updatePatinetStatus = await this.userModel.findByIdAndUpdate(
        this.als.getUserId(),
        {
          $push: {
            appointmentStatus: {
              appointment: true,
              patient: {
                patientnumber: getcurrentDayNumebr.laterNumber.number,
                time: Time,
                day: currentDay,
                date: date.date,
              },
            },
          },
        },
        {
          new: true,
          session: session,
        },
      );
      if (updatePatinetStatus) {
        console.log('test4->passed');
      } else {
        console.log('test4->failed');
        return false;
      }

      const createAppointment = await this.appointmentModel.create(
        [
          {
            doctor: String(doctorData?.id), // must be a valid ObjectId (string form is fine)
            patient: this.als.getUserId(), // must also be valid ObjectId string
            Appointments: {
              day: currentDay,
              date: date.date,
              Time: Time,
            },
          },
        ],
        { session },
      );
      if (createAppointment) {
        console.log('test10->passed');
      } else {
        console.log('test10->failed');
        return false;
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof Error) {
        console.log(`error:${error.message}`);
        throw new Error(error.message);
      }
    } finally {
      await session.endSession();
    }
  }

  public async startEarly() {}
  public async bookAppointmentManually(body: BookAppointmentManuallyDto) {}
  public async cancleAppointment(body: CancleAppointmentDto) {}
  public async History() {}
  public async getDoctorDetails() {}
  public async fetchSidebarContent() {}
  public async findTheNearest() {}
  public async applyFilter(body: ApplyFilterDto) {}
  public async searchAsYouType(body: searchAsYouTypeDto) {}
}
