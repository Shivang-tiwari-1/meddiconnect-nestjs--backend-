import { Module } from '@nestjs/common';
import { FileUploadService } from './fileupload.service';

@Module({
  exports: [FileUploadService],
  providers: [FileUploadService],
})
export class FileUploadModuel {}
