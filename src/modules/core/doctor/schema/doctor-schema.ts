import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type DoctorDocument = HydratedDocument<Doctor>;

@Schema({ timestamps: true })
export class Doctor {
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

  @Prop({
    type: [{ field: { type: String, required: true } }],
  })
  specialization: {
    field: string;
  }[];
  @Prop({ type: Number })
  Max: number;
  @Prop([
    {
      day: { type: String },
      start: { type: String },
      end: { type: String },
      date: { type: String },
      laterNumber: { number: { type: Number, default: 0 } },
      available: { type: Boolean, default: false },
    },
  ])
  availability: {
    _id: Types.ObjectId;
    day: string;
    start: string;
    end: string;
    date: string;
    laterNumber: {
      number: number;
    };
    available: boolean;
  }[];

  @Prop({ type: String, required: true })
  city: string;
  @Prop({ type: String })
  postcode: number;
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
  @Prop({ type: Number })
  charges: number;
}
export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.index({ coordinates: '2dsphere' });
DoctorSchema.index({ role: 1 });
