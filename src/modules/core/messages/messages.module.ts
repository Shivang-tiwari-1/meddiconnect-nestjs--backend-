import { Module } from '@nestjs/common';
import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
