import { Types } from 'mongoose';

export interface Availablalitytype {
  _id: Types.ObjectId;
  day: string;
  start: string;
  end: string;
  date: string;
  laterNumber: {
    number: number;
  };
  available: boolean;
}
