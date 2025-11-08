import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Appointment,
  AppointmentSchema,
} from 'src/modules/core/appointment/schema/appointment';
import {
  Qualification,
  QualificationSchema,
} from 'src/modules/core/doctor/schema/doctor-qualification';
import {
  Doctor,
  DoctorSchema,
} from 'src/modules/core/doctor/schema/doctor-schema';
import {
  Message,
  messageSchema,
} from 'src/modules/core/messages/schema/message.schema';
import { User, UserSchema } from 'src/modules/core/user/schema/user-schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: process.env.MONGO_URI }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: messageSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Qualification.name, schema: QualificationSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
