import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, TenantContext } from '@remotfix/types';
import {
  acceptInviteSchema,
  forgotPasswordSchema,
  loginSchema,
  mfaSetupSchema,
  refreshTokenSchema,
  resetPasswordSchema,
} from '@remotfix/validation';
import { Request, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import {
  AcceptInviteDto,
  ForgotPasswordDto,
  LoginDto,
  MfaSetupDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { MfaService } from './mfa.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService
  ) {}

  @Public()
  @UseGuards(RateLimitGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user credentials and issue tokens' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async login(
    @Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginDto, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if ('refreshToken' in result && result.refreshToken) {
      // Fix SEC-03: Set cookie path to /api/v1/auth so browser sends it to /refresh AND /logout
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    // Fix SEC-12: Strip raw refreshToken from JSON response payload
    const safeData = { ...result };
    delete (safeData as any).refreshToken;

    return {
      success: true,
      data: safeData,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renew access token using Redis-backed refresh token' })
  async refresh(
    @Body(new ZodValidationPipe(refreshTokenSchema)) body: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = body?.refreshToken || req.cookies?.refreshToken;
    const result = await this.authService.refresh(token);

    if (result.refreshToken) {
      // Fix SEC-03 & SEC-10: Set rotated refresh token in /api/v1/auth cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    // Fix SEC-12: Strip raw refreshToken from JSON response
    return {
      success: true,
      data: { accessToken: result.accessToken },
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Terminate session and revoke refresh token' })
  async logout(
    @Body(new ZodValidationPipe(refreshTokenSchema)) body: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = body?.refreshToken || req.cookies?.refreshToken;
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    const result = await this.authService.logout(token, (req as any).user?.id);

    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  // Fix SEC-11: Add TenantGuard so request.tenant is properly populated
  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Retrieve current authenticated user profile and active tenant context' })
  async me(
    @CurrentUser() user: AuthenticatedUser,
    @CurrentTenant() tenant?: TenantContext
  ) {
    return {
      success: true,
      data: {
        user,
        activeTenant: tenant || null,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @UseGuards(RateLimitGuard)
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset with enumeration resistance' })
  async forgotPassword(@Body(new ZodValidationPipe(forgotPasswordSchema)) dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @UseGuards(RateLimitGuard)
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete password reset and invalidate sessions' })
  async resetPassword(@Body(new ZodValidationPipe(resetPasswordSchema)) dto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(dto);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('mfa/setup')
  @ApiOperation({ summary: 'Initiate MFA setup: generate TOTP secret and QR URL' })
  async mfaSetup(@CurrentUser() user: AuthenticatedUser) {
    // Fix SEC-04: Store pending secret server-side in Redis tied to user.id
    const result = await this.mfaService.generateMfaSecret(user.id, user.email);
    return {
      success: true,
      data: {
        otpauthUrl: result.otpauthUrl,
        secret: result.secret,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('mfa/enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify code and enable mandatory MFA' })
  async mfaEnable(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(mfaSetupSchema)) dto: MfaSetupDto
  ) {
    // Fix SEC-04: Verify against server-stored pending secret in Redis
    await this.mfaService.enableMfa(user.id, dto.token);
    return {
      success: true,
      data: { message: 'MFA enabled successfully' },
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @UseGuards(RateLimitGuard)
  @Post('accept-invite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Controlled onboarding: Accept team invitation' })
  async acceptInvite(@Body(new ZodValidationPipe(acceptInviteSchema)) dto: AcceptInviteDto) {
    const result = await this.authService.acceptInvite(dto);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }
}
