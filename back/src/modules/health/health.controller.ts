import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthResDto } from './res/health.res.dto';

@ApiTags('4.Health')
@Controller('healthz')
export class HealthController {
  @ApiOperation({ summary: 'Application health check' })
  @Get()
  public health(): HealthResDto {
    return { status: 'healthy' };
  }
}
