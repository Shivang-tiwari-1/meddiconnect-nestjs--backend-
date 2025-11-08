import { Injectable } from '@nestjs/common';
import {
  DeactivatingDto,
  RedisFetchDto,
  SaveConversationDto,
  SavingMessagesDto,
} from './dto/socket.dto';
import { SocketGateway } from 'src/modules/common/socketconnection/socketConnection.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly socketGateway: SocketGateway) {}
  public async deactivating(body: DeactivatingDto) {}

  public async goingOnline() {}

  public async savingMessages(body: SavingMessagesDto) {}

  public async redisFetch(body: RedisFetchDto) {}

  public async saveConversation(body: SaveConversationDto) {}

  public async getCoversation() {}
}
