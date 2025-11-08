import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/mongoose.db.module';
import { ComonController } from './common.controller';
import { CloudinaryModule } from './cloudinary/Cloudinary.module';
import { HelperModule } from './helpers/helpers.module';
import { SocketConnectionModule } from './socketconnection/soketConnection.module';
import { FileUploadModuel } from './fileUpload/fileupload.module';
import { JwtModule } from '@nestjs/jwt';
import { AgendaModule } from './agenda/agenda.module';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.GENERATE_TOKEN_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
    DatabaseModule,
    CloudinaryModule,
    FileUploadModuel,
    HelperModule,
    SocketConnectionModule,
    AgendaModule,
    RedisModule,
  ],
  controllers: [ComonController],
  providers: [],
})
export class CommonModule {}
