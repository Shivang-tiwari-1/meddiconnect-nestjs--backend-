import { Injectable } from '@nestjs/common';
import { userData } from './types';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/modules/core/user/schema/user-schema';
import { Model } from 'mongoose';
import moment from 'moment-timezone';
import { Updatedate } from '../agenda/types';

@Injectable()
export class HelperService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // public async GenerateTokens(user: Partial<userData>): Promise<
  //   | {
  //       accessToken?: string;
  //       refreshToken?: string;
  //       success: boolean;
  //       message?: string;
  //     }
  //   | string
  // > {
  //   try {
  //     const data = await this.userModel.findById<UserDocument>(user._id);
  //     if (!data) {
  //       throw new Error('User was not found');
  //     }

  //     // const accessToken = data?.generateAccessToken();
  //     // if (typeof accessToken !== 'string' || !accessToken) {
  //     //   throw new Error('Access token could not be generated');
  //     // }

  //     const refreshToken = data?.generateRefreshToken();
  //     if (typeof refreshToken !== 'string' || !refreshToken) {
  //       throw new Error('Refresh token could not be generated');
  //     }

  //     data.refreshToken = refreshToken;
  //     await data.save({ validateBeforeSave: false });

  //     return {
  //       success: true,
  //       refreshToken: refreshToken,
  //       accessToken: accessToken,
  //     };
  //   } catch (error) {
  //     return error instanceof Error
  //       ? error.message
  //       : 'An unknown error occurred';
  //   }
  // }
  public setDay(day: string | number) {
    if (typeof day === 'string') {
      switch (day.toLowerCase()) {
        case 'sunday':
          return (day = 0);
        case 'monday':
          return (day = 1);
        case 'tuesday':
          return (day = 2);
        case 'wednesday':
          return (day = 3);
        case 'thursday':
          return (day = 4);
        case 'friday':
          return (day = 5);
        case 'saturday':
          return (day = 6);
        default:
          throw new Error('Invalid day string');
      }
    } else if (typeof day === 'number') {
      switch (day) {
        case 0:
          return 'sunday';
        case 1:
          return 'monday';
        case 2:
          return 'tuesday';
        case 3:
          return 'wednesday';
        case 4:
          return 'thursday';
        case 5:
          return 'friday';
        case 6:
          return 'saturday';
        default:
          throw new Error('Invalid day number');
      }
    } else {
      throw new Error('Day must be either a string or a number');
    }
  }

  public updateAvailabilityDates(days: string[], times: string[]) {
    console.log('from function ->', days, times);

    const dayOfWeek: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    return days.map((day, index) => {
      const lowerDay = day.toLowerCase();
      const dayNumber = dayOfWeek[lowerDay];

      if (dayNumber === undefined) {
        throw new Error(`Invalid day: ${day}`);
      }

      const now = moment.tz('Asia/Kolkata');
      const scheduledTargetTime = now.clone().day(dayNumber);

      scheduledTargetTime
        .hour(moment(times[index], 'HH:mm:ss').hour())
        .minute(moment(times[index], 'HH:mm:ss').minute())
        .second(0)
        .millisecond(0)
        .add(7, 'days');

      return {
        reAgetedTime: scheduledTargetTime.toISOString(),
        date: scheduledTargetTime.format('MM-DD-YYYY'),
      };
    });
  }

  public dayTimeManagment(day: string, end?: string) {
    const dayNumber: number | string = this.setDay(day);
    const now = moment().tz('Asia/Kolkata');
    const targetDateTime = now.clone().day(dayNumber);
    if (
      now.day() > (dayNumber as number) ||
      (now.day() === dayNumber && now.isAfter(targetDateTime))
    ) {
      targetDateTime.add(1, 'week');
    }

    targetDateTime
      .hour(moment(end, 'hh:mm A').hour())
      .minute(moment(end, 'hh:mm A').minute())
      .second(0)
      .millisecond(0);
    return {
      targetDateTime: targetDateTime.toString(),
      date: targetDateTime.format('MM-DD-YYYY'),
    };
  }

  public createCurrentDay() {
    const now = new Date();
    const currentDay = now
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase()
      .toString();
    return currentDay;
  }

  public createTime = (time: string) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  };

  public currentTime = () => {
    const now = new Date();
    const currentTime = now.toISOString();
    return currentTime;
  };

  public cerateCurrentDate = () => {
    const currentDate = moment();
    return currentDate.format('YYYY-MM-DD');
  };

  public convertToISOTime = function (time12h: string) {
    const [time, period] = time12h.split(' ');

    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);
    const isoString = date.toISOString().slice(0, -1);
    return isoString;
  };
}
