import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) phone: string;
  @Prop({ required: true }) gender: string;
  @Prop({ unique: true, sparse: true }) profileImage?: string;
  @Prop({ required: true }) address: string;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  })
  coordinates: { type: 'Point'; coordinates: [number, number] };

  @Prop() refreshToken?: string;
  @Prop({ required: true }) role: string;

  @Prop([
    {
      prescription: { type: Buffer, required: true },
      date: { type: String, required: true },
    },
  ])
  prescriptions: { prescription: Buffer; date: string }[];

  @Prop([
    {
      appointment: { type: Boolean, default: false },
      patient: [
        {
          patientnumber: { type: Number, required: true },
          time: { type: String, required: true },
          day: { type: String, required: true },
          date: { type: String, required: true },
        },
      ],
    },
  ])
  appointmentStatus: {
    appointment: boolean;
    patient: {
      patientnumber: number;
      time: string;
      day: string;
      date: string;
    }[];
  }[];

  //this is no right here we will need separate schema for this
  @Prop([
    {
      doctorId: { type: String, ref: 'Doctor', required: true },
      date: { type: String, required: true },
      time: { type: String, default: '' },
      day: { type: String, default: '' },
      visited: {
        type: String,
        enum: ['fulfilled', 'finished', 'pending', 'missed'],
        default: 'pending',
      },
    },
  ])
  history: {
    doctorId: Types.ObjectId;
    date: string;
    time: string;
    day: string;
    visited: 'fulfilled' | 'finished' | 'pending' | 'missed';
  }[];

  @Prop({ required: true }) city: string;
  @Prop() postcode?: number;
  @Prop({
    type: String,
    enum: [
      'andhra Pradesh',
      'arunachal Pradesh',
      'assam',
      'bihar',
      'chhattisgarh',
      'goa',
      'gujarat',
      'haryana',
      'himachal Pradesh',
      'jharkhand',
      'karnataka',
      'kerala',
      'madhya Pradesh',
      'maharashtra',
      'manipur',
      'meghalaya',
      'mizoram',
      'nagaland',
      'odisha',
      'punjab',
      'rajasthan',
      'sikkim',
      'tamil Nadu',
      'telangana',
      'tripura',
      'uttar Pradesh',
      'uttarakhand',
      'west Bengal',
    ],
    required: true,
  })
  state: string;

  @Prop() station?: string;
  @Prop([{ id: { type: String, required: true } }]) favorite: { id: string }[];
  @Prop({ type: Boolean, default: false }) isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ coordinates: '2dsphere' });
UserSchema.index({ role: 1 });
