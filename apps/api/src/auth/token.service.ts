import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PermissionKey, SystemRole } from '@remotfix/types';
import { randomBytes } from 'crypto';
import { RedisService } from '../common/redis/redis.service';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  orgId: string;
  roleId: string;
  roleName: SystemRole | string;
  permissions: PermissionKey[];
}

export interface RefreshTokenSession {
  userId: string;
  orgId: string;
  roleId: string;
  roleName: SystemRole | string;
  createdAt: number;
}

@Injectable()
export class TokenService {
  // D-M4-01: Short-lived access tokens (15m) and Redis-backed refresh tracking (7d)
  private readonly ACCESS_TOKEN_TTL = 15 * 60; // 15 minutes in seconds
  private readonly REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService
  ) {}

  /**
   * Generates a short-lived JWT access token.
   */
  async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.ACCESS_TOKEN_TTL,
    });
  }

  /**
   * Verifies and decodes a JWT access token.
   */
  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync<AccessTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  /**
   * Issues a new refresh token and tracks state in Redis (D-M4-01 & D-M4-04).
   */
  async generateRefreshToken(sessionData: RefreshTokenSession): Promise<string> {
    const refreshToken = randomBytes(32).toString('hex');
    const redisKey = `session:refresh:${refreshToken}`;

    // Store session details in Redis with 7-day TTL
    await this.redis.set(redisKey, JSON.stringify(sessionData), this.REFRESH_TOKEN_TTL);

    // Track active session index for this user
    await this.redis.sadd(`user:sessions:${sessionData.userId}`, refreshToken);
    await this.redis.expire(`user:sessions:${sessionData.userId}`, this.REFRESH_TOKEN_TTL);

    return refreshToken;
  }

  /**
   * Validates refresh token existence in Redis.
   */
  async validateRefreshToken(token: string): Promise<RefreshTokenSession> {
    const redisKey = `session:refresh:${token}`;
    const rawData = await this.redis.get(redisKey);

    if (!rawData) {
      throw new UnauthorizedException('Refresh token is invalid or has been revoked');
    }

    try {
      return JSON.parse(rawData) as RefreshTokenSession;
    } catch {
      throw new UnauthorizedException('Malformed session state in Redis');
    }
  }

  /**
   * Rotates a refresh token: revokes the old token and issues a new one atomically.
   */
  async rotateRefreshToken(oldToken: string, sessionData: RefreshTokenSession): Promise<string> {
    const newToken = randomBytes(32).toString('hex');
    const oldKey = `session:refresh:${oldToken}`;
    const newKey = `session:refresh:${newToken}`;
    const userSessionsKey = `user:sessions:${sessionData.userId}`;

    // Atomically swap old token for new token in Redis
    const pipeline = this.redis.getClient().pipeline();
    pipeline.del(oldKey);
    pipeline.srem(userSessionsKey, oldToken);
    pipeline.set(newKey, JSON.stringify(sessionData), 'EX', this.REFRESH_TOKEN_TTL);
    pipeline.sadd(userSessionsKey, newToken);
    pipeline.expire(userSessionsKey, this.REFRESH_TOKEN_TTL);
    await pipeline.exec();

    return newToken;
  }

  /**
   * Revokes a specific refresh token (used during logout).
   */
  async revokeRefreshToken(token: string): Promise<void> {
    const redisKey = `session:refresh:${token}`;
    const rawData = await this.redis.get(redisKey);

    if (rawData) {
      try {
        const session = JSON.parse(rawData) as RefreshTokenSession;
        await this.redis.srem(`user:sessions:${session.userId}`, token);
      } catch {
        // ignore parse error during revocation
      }
      await this.redis.del(redisKey);
    }
  }

  /**
   * Invalidate all sessions for a user (used upon password change / account suspension).
   */
  async invalidateAllUserSessions(userId: string): Promise<void> {
    const userSessionsKey = `user:sessions:${userId}`;
    const tokens = await this.redis.smembers(userSessionsKey);

    if (tokens && tokens.length > 0) {
      for (const token of tokens) {
        await this.redis.del(`session:refresh:${token}`);
      }
    }

    await this.redis.del(userSessionsKey);

    // Record revocation timestamp to invalidate existing access tokens immediately (SEC-13)
    await this.redis.set(`auth:revoked_before:${userId}`, Math.floor(Date.now() / 1000).toString(), 15 * 60);
  }
}
