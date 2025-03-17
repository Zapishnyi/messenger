import { ApiProperty } from '@nestjs/swagger';

export class HealthResDto {
  @ApiProperty({ type: 'string', example: 'healthy' })
  status: 'healthy';
}
