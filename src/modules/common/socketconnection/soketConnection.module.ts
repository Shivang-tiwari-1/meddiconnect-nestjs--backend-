import { Module } from '@nestjs/common';
import { SocketGateway } from './socketConnection.gateway';

@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketConnectionModule {}
