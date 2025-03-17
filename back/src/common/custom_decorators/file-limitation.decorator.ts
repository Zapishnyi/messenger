import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

export const FileLimitation = (
  file_name: string,
  file_size: number,
): MethodDecorator => {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(file_name, 10, {
        limits: { fileSize: file_size }, // Limit file size
        fileFilter: (req, file, callback) => {
          callback(null, true);
        },
      }),
    ),
  );
};
