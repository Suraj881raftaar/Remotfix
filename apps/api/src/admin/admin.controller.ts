import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { provisionTenantSchema, ProvisionTenantInput } from '@remotfix/validation';
import { Public } from '../common/decorators/public.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { OnboardingService } from './onboarding.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Public()
  @Post('onboard')
  @ApiOperation({ summary: 'Controlled initial tenant onboarding (operator only)' })
  @ApiHeader({
    name: 'x-admin-key',
    description: 'Operator provisioning secret key',
    required: true,
  })
  async onboard(
    @Headers('x-admin-key') adminKey: string | undefined,
    @Body(new ZodValidationPipe(provisionTenantSchema)) dto: ProvisionTenantInput
  ) {
    const requiredKey =
      process.env.ADMIN_KEY ||
      process.env.OPERATOR_KEY ||
      process.env.ADMIN_PROVISIONING_KEY ||
      process.env.APP_SECRET;

    if (!requiredKey || !adminKey || adminKey !== requiredKey) {
      throw new UnauthorizedException('Invalid or missing operator provisioning key (x-admin-key)');
    }

    const result = await this.onboardingService.provisionOrganizationWithOwner(dto);

    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }
}
