import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@remotfix.io' })
  email!: string;

  @ApiProperty({ example: 'P@ssword12345!' })
  password!: string;

  @ApiPropertyOptional({ example: '00000000-0000-0000-0000-000000000001' })
  organizationId?: string;

  @ApiPropertyOptional({ example: '123456' })
  mfaCode?: string;
}

export class RefreshTokenDto {
  @ApiPropertyOptional({ example: 'f81d4fae7dec11d0a76500a0c91e6bf6...' })
  refreshToken?: string;
}

export class MfaSetupDto {
  @ApiProperty({ example: '123456' })
  token!: string;
}

export class MfaVerifyDto {
  @ApiProperty({ example: '123456' })
  token!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-uuid' })
  token!: string;

  @ApiProperty({ example: 'NewStrongPassword123!' })
  newPassword!: string;
}

export class AcceptInviteDto {
  @ApiProperty({ example: 'invite-token-uuid' })
  token!: string;

  @ApiProperty({ example: 'InitPassword123!' })
  password!: string;

  @ApiPropertyOptional({ example: 'Jane' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  lastName?: string;
}
