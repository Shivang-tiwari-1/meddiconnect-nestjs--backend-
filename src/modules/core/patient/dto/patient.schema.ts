import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BookAppointmentManuallyDto {
  @IsNotEmpty()
  day: string;

  @IsNotEmpty()
  time: string;
}

export class CancleAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class searchAsYouTypeDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}

export class FetchAllDoctors {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  @IsOptional()
  distance?: unknown;

  @IsNotEmpty()
  @IsOptional()
  coordinates?: unknown;

  @IsNotEmpty()
  @IsOptional()
  lastId?: string;

  @IsNotEmpty()
  @IsOptional()
  lastIdKey?: string;

  @IsNotEmpty()
  @IsOptional()
  redisKey?: string;
}

export class ApplyFilterDto {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  treatment: string;

  @IsNotEmpty()
  distance: unknown;

  @IsNotEmpty()
  coordinates: unknown;

  @IsNotEmpty()
  lastId: string;

  @IsNotEmpty()
  lastIdKey: string;

  @IsNotEmpty()
  redisKey: string;
}
