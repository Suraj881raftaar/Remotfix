import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse as SwaggerApiResponse, ApiTags } from '@nestjs/swagger';
import type { HealthStatus } from '@remotfix/types';

@ApiTags('Infrastructure')
@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  @Get()
  @ApiOperation({ summary: 'System liveness and readiness probe' })
  @SwaggerApiResponse({ status: 200, description: 'Service is healthy' })
  check(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }
}
