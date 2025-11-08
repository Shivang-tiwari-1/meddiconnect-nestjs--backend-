import { Types } from 'mongoose';

export interface userData {
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
  address: string;
  role: string;
  gender: string;
  city: string;
  state: string;
}
