import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DeactivatingDto, SaveConversationDto } from './dto/socket.dto';
import { SocketService } from './socket.service';

@Controller('/api/socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Post('deactivating')
  public async deactivating(@Body() body: DeactivatingDto) {}

  @Post('goingOnline')
  public async goingOnline() {}

  @Post('savingMessages')
  public async savingMessages(@Query('receiverid') receiverid: string) {}

  @Get('redisFetch')
  public async redisFetch(
    @Query('senderid') senderid: string,
    @Query('recipent') recipent: string,
    @Query('role') role: string,
    @Query('page') page: number,
  ) {}

  @Post('saveConversation')
  public async saveConversation(@Body() body: SaveConversationDto) {}

  @Post('getCoversation')
  public async getCoversation() {}
}
