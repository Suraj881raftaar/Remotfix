import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { OnboardingService } from './onboarding.service';

@Module({
  controllers: [AdminController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class AdminModule {}
