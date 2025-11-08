import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeactivatingDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class SavingMessagesDto {
  @IsString()
  @IsNotEmpty()
  receiverid: string;

  @IsString()
  @IsNotEmpty()
  last_pointer: string;
}

export class RedisFetchDto {
  @IsString()
  @IsNotEmpty()
  senderid: string;

  @IsString()
  @IsNotEmpty()
  recipent: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNumber()
  @IsNotEmpty()
  page: number;
}

export class SaveConversationDto {
  @IsNotEmpty()
  doc: unknown;
}
