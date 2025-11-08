import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  BookAppointmentManuallyDto,
  CancleAppointmentDto,
} from './dto/patient.schema';
import { PatientService } from './patient.service';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor } from '../doctor/schema/doctor-schema';
import { Model } from 'mongoose';

@Controller('/api/patient')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
  ) {}

  @Get('fetchAllDoctors')
  public async fetchAllDoctors(
    @Query('page') page: number,
    @Query('distance') distance?: number,
    @Query('lastIdKey') lastIdKey?: string,
    @Query('coordinates') coordinates?: Array<Record<string, unknown>>,
    @Query('redisKey') redisKey?: string,
    @Query('lastId') lastId?: string,
  ) {
    if (distance) {
      console.log('object');
    }
    console.log(
      'page->',
      page,
      'distance->',
      distance,
      'lastId->',
      lastId,
      'lastIdKey->',
      lastIdKey,
      'redisKey->',
      redisKey,
    );
    return this.patientService.fetchAllDoctors({
      page: page,
      distance: distance,
      lastIdKey: lastIdKey,
      coordinates: coordinates,
      redisKey: redisKey,
      lastId: lastId,
    });
  }

  @Post('bookAppointemnt')
  public async bookAppointemnt(@Query('docid') docid: string) {
    console.log('---->', docid);
    return await this.patientService.bookAppointment(docid);
  }

  public async bookAppointmentManually(
    @Body() body: BookAppointmentManuallyDto,
  ) {}

  public async CancleAppointment(@Body() body: CancleAppointmentDto) {}

  public async History() {}

  public async getDoctorDetails() {}

  public async fetchSidebarContent() {}

  public async findthenearest(
    @Query('page') page: number,
    @Query('city') city: string,
    @Query('distance') distance: number,
    @Query('treatment') treatment: string,
    @Query('coordinates') coordinates: Array<Record<string, unknown>>,
    @Query('redisKey') redisKey: number,
    @Body() body: { lastId: string },
  ) {}

  public async searchAsYouType(@Query('text') text: string) {}
}
