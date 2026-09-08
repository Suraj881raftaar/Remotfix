import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

@Injectable()
export class CryptoService {
  private key: Buffer;

  constructor() {
    const rawKey = process.env.MFA_ENCRYPTION_KEY || process.env.APP_SECRET;
    if (!rawKey || rawKey.length < 32) {
      throw new Error(
        'FATAL: MFA_ENCRYPTION_KEY or APP_SECRET environment variable is missing or shorter than 32 characters.'
      );
    }
    this.key = createHash('sha256').update(rawKey).digest();
  }

  /**
   * Encrypts sensitive secrets at rest using AES-256-GCM.
   * Format: iv:authTag:ciphertext (hex encoded)
   */
  encrypt(plaintext: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  /**
   * Decrypts AES-256-GCM encrypted payload.
   */
  decrypt(payload: string): string {
    const parts = payload.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted payload format');
    }

    const [ivHex, tagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  }
}
