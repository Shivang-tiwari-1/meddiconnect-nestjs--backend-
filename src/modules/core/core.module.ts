import { Module } from '@nestjs/common';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './messages/messages.module';
import { SocketModule } from './socket/socket.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    DoctorModule,
    PatientModule,
    UserModule,
    MessageModule,
    SocketModule,
    AppointmentModule,
  ],
})
export class CoreModule {}
