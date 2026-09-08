import { Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';

@Injectable()
export class PasswordService {
  /**
   * Hashes a plaintext password irreversibly using Argon2id.
   * Parameters deliberately configured to resist offline dictionary/GPU attacks:
   * memoryCost: 64MB (65536 KB), timeCost: 3 iterations, parallelism: 4 threads.
   */
  async hash(password: string): Promise<string> {
    return hash(password, {
      memoryCost: 65536,
      timeCost: 3,
      outputLen: 32,
      parallelism: 4,
    });
  }

  /**
   * Verifies a plaintext candidate against an Argon2id hash.
   * Returns true if valid, false otherwise.
   */
  async verify(password: string, hashString: string): Promise<boolean> {
    try {
      return await verify(hashString, password);
    } catch {
      return false;
    }
  }
}
