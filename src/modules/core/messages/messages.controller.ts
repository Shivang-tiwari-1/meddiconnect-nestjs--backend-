import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessageService } from './messages.service';

@Controller('/api/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get('patientchat')
  public async patientchat(
    @Param('id') id: string,
    @Query('redisKey') redisKey: string,
  ) {
    return this.messageService.fetchMessagePatients({
      id: id,
      redisKey: redisKey,
    });
  }

  @Get('doctorchat')
  public async doctorchat(
    @Param('id') id: string,
    @Query('redisKey') redisKey: string,
  ) {
    return this.messageService.fetchMessageDoctors({
      id: id,
      redisKey: redisKey,
    });
  }

  @Get('patientsTextedtToDoc')
  public async patientsTextedtToDoc(@Query('redisKey') redisKey: string) {
    return this.messageService.fetchPatTextToDoc({ redisKey: redisKey });
  }

  @Get('doctorsTextedToPat')
  public async doctorsTextedToPat(@Query('redisKey') redisKey: string) {
    return this.messageService.fetchDocTextToDoc({ redisKey: redisKey });
  }

  @Get('bulkriteToDb')
  public async bulkriteToDb() {}
}
