import { Injectable } from '@nestjs/common';
import { UploadResult } from './types';
import { v2 } from 'cloudinary';
import fs from 'fs';
@Injectable()
export class FileUploadService {
  public async uploadSingleImage(
    localFile: Express.Multer.File,
  ): Promise<UploadResult> {
    console.log('object3');
    try {
      if (!localFile) {
        return { success: false, message: 'No file provided' };
      }
      console.log(localFile.path);

      const upload = await v2.uploader.upload(localFile.path, {
        folder: 'Mediconnect',
      });

      fs.unlinkSync(localFile.path);

      return {
        success: true,
        urls: upload.secure_url,
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  public async uploadMultipleFiles(
    localFilePaths: Express.Multer.File[][], // typed properly
  ): Promise<UploadResult> {
    try {
      const uploadFiles: string[] = [];

      for (const files of localFilePaths) {
        const filePath = files[0]?.path;

        if (!filePath || !fs.existsSync(filePath)) {
          return { success: false, message: 'File was not found' };
        }

        const fileStream = fs.createReadStream(filePath);

        const uploadResult = await new Promise<string>((resolve, reject) => {
          const uploadStream = v2.uploader.upload_stream(
            { folder: 'Mediconnect' },
            (error, result) => {
              if (error) {
                reject(new Error(error.message));
              } else {
                resolve(result?.secure_url || '');
              }
            },
          );

          fileStream.pipe(uploadStream);
        });

        uploadFiles.push(uploadResult);
        fs.unlinkSync(filePath);
      }

      return {
        success: true,
        urls: uploadFiles,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown upload error',
      };
    }
  }
}
