import { File } from 'buffer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class SetDeatailsDto {
  @IsNotEmpty()
  @IsOptional()
  _id: Types.ObjectId;
  @IsNotEmpty()
  @IsString()
  day: string;
  @IsNotEmpty()
  @IsString()
  start: string;
  @IsNotEmpty()
  @IsString()
  end: string;
  @IsNotEmpty()
  @IsString()
  date: string;
  @IsNotEmpty()
  @IsNumber()
  HowManyPatients: number;
}

export class PrescribeMedicineDto {
  @IsNotEmpty()
  prescription: File;
}

export class SpealisesInDto {
  @IsNotEmpty()
  @IsArray()
  specialization: Array<Record<string, unknown>>;
}

export class QuallificationDto {
  MedicalRegistrationCertificate: File;
}
