import { Module } from '@nestjs/common';
import { HelperModule } from '../helpers/helpers.module';
import { AgendaService } from './agenda.service';
import { AppointmentModule } from 'src/modules/core/appointment/appointment.module';

@Module({
  imports: [HelperModule, AppointmentModule],
  exports: [AgendaService],
  providers: [AgendaService],
})
export class AgendaModule {}
