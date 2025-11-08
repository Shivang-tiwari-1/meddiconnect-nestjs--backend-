// src/modules/common/fileUpload/interceptors/upload.interceptor.ts
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

export function ProfileImageInterceptor(name: string) {
  return FileInterceptor(name, {
    storage: diskStorage({
      destination: join(
        process.cwd(),
        'src',
        'modules',
        'common',
        'fileUpload',
        'public',
      ),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      },
    }),
  });
}
