import { Module } from '@nestjs/common';
import { SocketConnectionModule } from 'src/modules/common/socketconnection/soketConnection.module';
import { SocketService } from './socket.service';

@Module({
  imports: [SocketConnectionModule],
  providers: [SocketService],
})
export class SocketModule {}
