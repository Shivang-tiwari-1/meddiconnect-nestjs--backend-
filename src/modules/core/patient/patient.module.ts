import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { HelperModule } from 'src/modules/common/helpers/helpers.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { CacheMiddleware } from 'src/modules/common/Middleware/cache.Middleware';

@Module({
  imports: [HelperModule, AppointmentModule],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CacheMiddleware).forRoutes('/api/patient/fetchAllDoctors');
  }
}
