import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly MAX_REQUESTS = 10;
  private readonly WINDOW_SECONDS = 60;

  constructor(private readonly redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Use trusted Express request.ip (configured with trust proxy in main.ts)
    const ip = request.ip || request.socket?.remoteAddress || '127.0.0.1';

    const route = request.path || 'unknown';
    const key = `ratelimit:${ip}:${route}`;

    // Atomic pipeline execution prevents infinite TTL race condition
    const pipeline = this.redis.getClient().pipeline();
    pipeline.incr(key);
    pipeline.expire(key, this.WINDOW_SECONDS);
    const results = await pipeline.exec();
    const currentCount = (results?.[0]?.[1] as number) || 1;

    if (currentCount > this.MAX_REQUESTS) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests from this IP address. Please try again later.',
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}
