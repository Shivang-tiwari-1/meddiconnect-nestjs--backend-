import { Injectable } from '@nestjs/common';
import {
  fetchDocTextToDocDto,
  fetchMessageDoctorsDto,
  fetchMessagePatientsDto,
  fetchPatTextToDocDto,
} from './dto/message.dto';

@Injectable()
export class MessageService {
  public async fetchMessagePatients(body: fetchMessagePatientsDto) {}

  public async fetchMessageDoctors(body: fetchMessageDoctorsDto) {}

  public async fetchPatTextToDoc(body: fetchPatTextToDocDto) {}

  public async fetchDocTextToDoc(body: fetchDocTextToDocDto) {}
}
