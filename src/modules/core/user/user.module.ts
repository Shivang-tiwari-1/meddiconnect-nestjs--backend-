import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AlsModule } from 'src/modules/common/als/als.module';
import { HelperModule } from 'src/modules/common/helpers/helpers.module';
import { FileUploadModuel } from 'src/modules/common/fileUpload/fileupload.module';
import { AuthModule } from 'src/modules/common/auth/auth.module';

@Module({
  imports: [AlsModule, HelperModule, FileUploadModuel, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
