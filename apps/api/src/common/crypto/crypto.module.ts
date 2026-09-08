import { Global, Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { PasswordService } from './password.service';

@Global()
@Module({
  providers: [PasswordService, CryptoService],
  exports: [PasswordService, CryptoService],
})
export class CryptoModule {}
