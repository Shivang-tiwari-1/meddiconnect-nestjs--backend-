import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { AgendaModule } from 'src/modules/common/agenda/agenda.module';
import { HelperModule } from 'src/modules/common/helpers/helpers.module';

@Module({
  imports: [AgendaModule, HelperModule],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
