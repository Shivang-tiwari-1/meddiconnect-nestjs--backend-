import { IsNotEmpty, IsString } from 'class-validator';

export class fetchMessagePatientsDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  redisKey: string;
}

export class fetchMessageDoctorsDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  redisKey: string;
}

export class fetchPatTextToDocDto {
  @IsNotEmpty()
  @IsString()
  redisKey: string;
}

export class fetchDocTextToDocDto {
  @IsNotEmpty()
  @IsString()
  redisKey: string;
}
