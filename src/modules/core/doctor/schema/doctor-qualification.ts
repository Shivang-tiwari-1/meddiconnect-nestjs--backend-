import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QualificationDocument = HydratedDocument<Qualification>;
@Schema({ timestamps: true })
export class Qualification {
  @Prop({ type: String, required: true })
  doctorid: string;
  @Prop({ type: String, required: true })
  MedicalRegistrationCertificate: string;
  @Prop({ type: String, required: true })
  MBBSDegree: string;
  @Prop({ type: String, required: true })
  StateMedicalCouncilRegistration: string;
}

export const QualificationSchema = SchemaFactory.createForClass(Qualification);

QualificationSchema.index({ doctorid: 1 });
