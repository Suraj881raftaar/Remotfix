import { BadRequestException, Injectable } from '@nestjs/common';
import { generateSecret, generateURI, verifySync } from 'otplib';
import { CryptoService } from '../common/crypto/crypto.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class MfaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly redis: RedisService
  ) {}

  /**
   * Generates a new TOTP secret seed and QR code URI conforming to RFC 6238.
   * Stores the pending encrypted secret server-side in Redis with 10-minute TTL.
   */
  async generateMfaSecret(userId: string, email: string): Promise<{ secret: string; otpauthUrl: string }> {
    const secret = generateSecret();
    const encryptedSecret = this.crypto.encrypt(secret);
    const otpauthUrl = generateURI({
      issuer: 'REMOTFIX',
      label: email,
      secret,
    });

    // Store pending secret server-side in Redis with 10-minute TTL (600 seconds)
    await this.redis.set(`mfa:pending:${userId}`, encryptedSecret, 600);

    return {
      secret,
      otpauthUrl,
    };
  }

  /**
   * Verifies a TOTP token against an encrypted secret.
   * Enforces replay prevention by storing used token in Redis for 60 seconds.
   */
  async verifyMfaToken(userId: string, token: string, encryptedSecret: string): Promise<boolean> {
    if (!token || token.trim().length !== 6) {
      return false;
    }

    // 1. Replay prevention check in Redis
    const replayKey = `mfa:used:${userId}:${token}`;
    const alreadyUsed = await this.redis.get(replayKey);
    if (alreadyUsed) {
      return false;
    }

    try {
      // 2. Decrypt secret using AES-256-GCM
      const secret = this.crypto.decrypt(encryptedSecret);

      // 3. Verify TOTP token using otplib RFC 6238
      const result = verifySync({ token, secret });
      if (!result || !result.valid) {
        return false;
      }

      // 4. Mark token as consumed in Redis (60s TTL) to prevent replay
      await this.redis.set(replayKey, '1', 60);

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Confirms and activates MFA for a user after testing a valid code against server-side pending secret.
   */
  async enableMfa(userId: string, token: string): Promise<void> {
    const pendingSecret = await this.redis.get(`mfa:pending:${userId}`);
    if (!pendingSecret) {
      throw new BadRequestException('MFA setup session expired or not initialized. Please initiate setup again.');
    }

    const isValid = await this.verifyMfaToken(userId, token, pendingSecret);
    if (!isValid) {
      throw new BadRequestException('Invalid MFA verification code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: true,
        mfaSecret: pendingSecret,
      },
    });

    await this.redis.del(`mfa:pending:${userId}`);
  }
}
