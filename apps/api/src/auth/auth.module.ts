import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuditService } from '../common/services/audit.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET || process.env.APP_SECRET;
        if (!secret || secret.length < 32) {
          throw new Error(
            'FATAL: JWT_SECRET or APP_SECRET environment variable is missing or shorter than 32 characters.'
          );
        }
        return {
          secret,
          signOptions: { expiresIn: '15m' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, MfaService, AuditService],
  exports: [AuthService, TokenService, MfaService, AuditService, JwtModule],
})
export class AuthModule {}
