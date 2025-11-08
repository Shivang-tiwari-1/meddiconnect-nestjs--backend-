import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  PrescribeMedicineDto,
  SetDeatailsDto,
  SpealisesInDto,
} from './dto/doctor.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DoctorService } from './doctor.service';

@Controller('/api/doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
  @Post('setDetails')
  public async setDetails(@Body() body: SetDeatailsDto[]) {
    return this.doctorService.setCriteria(body);
  }

  @Post('getDetailOfthePatient')
  public async getDetailOfthePatient() {}

  @Post('manualUpdate')
  public async manualUpdate() {}

  @Post('prescribeMedicine')
  public async prescribeMedicine(@Body() body: PrescribeMedicineDto) {}

  @Post('spealisesIn')
  public async spealisesIn(@Body() body: SpealisesInDto) {}

  @Post('patientHistory')
  public async patientHistory() {}

  @Post('quallification')
  @UseInterceptors(FilesInterceptor('documents', 3))
  public async Quallification(@UploadedFiles() files: Express.Multer.File[]) {}
}
