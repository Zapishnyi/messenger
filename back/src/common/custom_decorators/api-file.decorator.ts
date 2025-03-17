import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export const ApiFile = (
  fileName: string,
  isArray = true,
  isRequired = true,
  size: string,
): MethodDecorator => {
  return applyDecorators(
    ApiBody({
      description: `Upload a file. The file should be less than   ${size}.`,
      schema: {
        type: 'object',
        required: isRequired ? [fileName] : [],
        properties: {
          [fileName]: isArray
            ? {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary',
                  description: 'File to upload.',
                },
              }
            : {
                type: 'string',
                format: 'binary',
                description: 'File to upload.',
              },
        },
      },
    }),
  );
};
