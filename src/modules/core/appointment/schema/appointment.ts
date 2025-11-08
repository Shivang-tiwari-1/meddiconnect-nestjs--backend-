import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;
@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: String, required: true })
  doctor: true;

  @Prop({ type: String, required: true })
  patient: true;

  @Prop([
    {
      day: { type: String },
      date: { type: String },
      appointmentAt: { type: String },
      Time: { type: String },
    },
  ])
  Appointments: {
    day: string;
    date: string;
    appointmentAt: string;
    Time: string;
  }[];
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// Indexes
AppointmentSchema.index({ doctor: 1, patient: 1 });
