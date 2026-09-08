import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PermissionKey, SystemRole } from '@remotfix/types';
import { randomBytes } from 'crypto';
import { PasswordService } from '../common/crypto/password.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';
import { AuditService } from '../common/services/audit.service';
import {
  AcceptInviteDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { MfaService } from './mfa.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly mfaService: MfaService,
    private readonly redis: RedisService,
    private readonly auditService: AuditService
  ) {}

  /**
   * Primary credential authentication endpoint.
   * Resists user enumeration by returning uniform error messages.
   */
  async login(loginDto: LoginDto, reqInfo?: { ip?: string; userAgent?: string }) {
    const email = loginDto.email.trim().toLowerCase();

    // 1. Query user with memberships and role permissions
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            organization: true,
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Uniform authentication failure response (anti-enumeration)
    const invalidAuthError = new UnauthorizedException('Invalid email or password');

    if (!user || user.status !== 'ACTIVE' || !user.passwordHash) {
      await this.auditService.log({
        action: 'auth:login:failure',
        resourceType: 'User',
        result: 'FAILURE',
        metadata: { reason: 'User not found, inactive, or uninitialized', emailAttempt: email },
      });
      // Mitigate timing attack: execute dummy Argon2id verification to match response timing (~100ms)
      await this.passwordService.verify(
        loginDto.password,
        '$argon2id$v=19$m=65536,t=3,p=4$dHVtbXlzYWx0MTIzNDU2Nw$0gK7W3L9H5y4C2v1B8n0M3q6Z1x4C7v0B2n4M6q8Z1x'
      );
      throw invalidAuthError;
    }

    // 2. Verify password via Argon2id (D-M4-02)
    const isPasswordValid = await this.passwordService.verify(
      loginDto.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      await this.auditService.log({
        action: 'auth:login:failure',
        actorId: user.id,
        resourceType: 'User',
        resourceId: user.id,
        result: 'FAILURE',
        metadata: { reason: 'Invalid password hash match' },
      });
      throw invalidAuthError;
    }

    // 3. MFA Verification check
    if (user.mfaEnabled) {
      if (!loginDto.mfaCode) {
        // Return 200 with challenge required payload
        return {
          mfaRequired: true,
          userId: user.id,
          message: 'Multi-factor authentication code required',
        };
      }

      if (!user.mfaSecret) {
        throw new UnauthorizedException('MFA configuration corrupted');
      }

      const isMfaValid = await this.mfaService.verifyMfaToken(
        user.id,
        loginDto.mfaCode,
        user.mfaSecret
      );

      if (!isMfaValid) {
        await this.auditService.log({
          action: 'auth:mfa:failed',
          actorId: user.id,
          resourceType: 'User',
          resourceId: user.id,
          result: 'FAILURE',
          metadata: { reason: 'Invalid MFA verification code' },
        });
        throw new UnauthorizedException('Invalid multi-factor authentication code');
      }
    }

    // 4. Resolve active tenant context
    const activeMemberships = user.memberships.filter(
      (m) => m.status === 'ACTIVE' && m.organization.status === 'ACTIVE'
    );

    if (activeMemberships.length === 0) {
      throw new ForbiddenException('User has no active organization memberships');
    }

    let selectedMembership = activeMemberships[0];
    if (loginDto.organizationId) {
      const match = activeMemberships.find(
        (m) => m.organizationId === loginDto.organizationId
      );
      if (!match) {
        throw new ForbiddenException('No active membership found in requested organization');
      }
      selectedMembership = match;
    }

    const permissions = selectedMembership.role.rolePermissions.map(
      (rp) => rp.permission.key as PermissionKey
    );

    // 5. Issue JWT access token + Redis-tracked refresh token (D-M4-01 & D-M4-04)
    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      orgId: selectedMembership.organizationId,
      roleId: selectedMembership.roleId,
      roleName: selectedMembership.role.name as SystemRole,
      permissions,
    });

    const refreshToken = await this.tokenService.generateRefreshToken({
      userId: user.id,
      orgId: selectedMembership.organizationId,
      roleId: selectedMembership.roleId,
      roleName: selectedMembership.role.name,
      createdAt: Date.now(),
    });

    // Update last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Audit log success
    await this.auditService.log({
      action: 'auth:login:success',
      actorId: user.id,
      organizationId: selectedMembership.organizationId,
      resourceType: 'User',
      resourceId: user.id,
      result: 'SUCCESS',
      metadata: {
        role: selectedMembership.role.name,
        ip: reqInfo?.ip,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mfaEnabled: user.mfaEnabled,
      },
      activeOrganization: {
        id: selectedMembership.organization.id,
        name: selectedMembership.organization.name,
        slug: selectedMembership.organization.slug,
        role: selectedMembership.role.name,
        permissions,
      },
    };
  }

  /**
   * Token renewal via Redis-backed refresh-token tracking (D-M4-01).
   */
  async refresh(refreshToken: string) {
    const session = await this.tokenService.validateRefreshToken(refreshToken);

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        memberships: {
          where: { organizationId: session.orgId },
          include: {
            organization: true,
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is inactive or suspended');
    }

    const membership = user.memberships[0];
    if (!membership || membership.status !== 'ACTIVE' || membership.organization.status !== 'ACTIVE') {
      throw new UnauthorizedException('Tenant membership is inactive or organization is suspended');
    }

    const permissions = membership.role.rolePermissions.map(
      (rp) => rp.permission.key as PermissionKey
    );

    const newAccessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      orgId: session.orgId,
      roleId: session.roleId,
      roleName: session.roleName,
      permissions,
    });

    // Rotate refresh token for replay protection (D-M4-01)
    const newRefreshToken = await this.tokenService.rotateRefreshToken(refreshToken, session);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Session termination and refresh-token invalidation (D-M4-01).
   */
  async logout(refreshToken: string, userId?: string) {
    if (refreshToken) {
      await this.tokenService.revokeRefreshToken(refreshToken);
    }

    if (userId) {
      await this.auditService.log({
        action: 'auth:logout',
        actorId: userId,
        resourceType: 'Session',
        result: 'SUCCESS',
      });
    }

    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Account enumeration-resistant password reset initiation.
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && user.status === 'ACTIVE') {
      const resetToken = randomBytes(32).toString('hex');
      // Store in Redis with 1 hour TTL (3600 seconds)
      await this.redis.set(`auth:reset:${resetToken}`, user.id, 3600);

      await this.auditService.log({
        action: 'auth:password_reset:request',
        actorId: user.id,
        resourceType: 'User',
        resourceId: user.id,
        result: 'SUCCESS',
      });
    }

    // Always return uniform response
    return {
      success: true,
      message: 'If an account exists for this email, password recovery instructions have been dispatched.',
    };
  }

  /**
   * Complete password recovery with secure token and session invalidation.
   */
  async resetPassword(dto: ResetPasswordDto) {
    const redisKey = `auth:reset:${dto.token}`;
    const userId = await this.redis.get(redisKey);

    if (!userId) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    if (dto.newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters in length');
    }

    const passwordHash = await this.passwordService.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Invalidate all active user sessions across devices (D-M4-01 security invariant)
    await this.tokenService.invalidateAllUserSessions(userId);
    await this.redis.del(redisKey);

    await this.auditService.log({
      action: 'auth:password_reset:success',
      actorId: userId,
      resourceType: 'User',
      resourceId: userId,
      result: 'SUCCESS',
    });

    return { success: true, message: 'Password has been successfully updated.' };
  }

  /**
   * Controlled onboarding: Accept invitation and initialize account.
   */
  async acceptInvite(dto: AcceptInviteDto) {
    const redisKey = `auth:invite:${dto.token}`;
    const rawData = await this.redis.get(redisKey);

    if (!rawData) {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    const { email, organizationId, roleId } = JSON.parse(rawData);

    if (dto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters in length');
    }

    // Locked Decision 1: NEVER overwrite password, firstName, or lastName for existing accounts.
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    const isAlreadyInitialized =
      existingUser &&
      existingUser.passwordHash &&
      existingUser.passwordHash !== 'UNINITIALIZED_INVITED_ACCOUNT';

    let resolvedUserId: string;

    if (isAlreadyInitialized && existingUser.passwordHash) {
      // Existing user must authenticate with their existing password
      const isPasswordValid = await this.passwordService.verify(
        dto.password,
        existingUser.passwordHash
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'An account with this email already exists. You must provide your existing account password to accept this invitation.'
        );
      }

      resolvedUserId = existingUser.id;

      // Activate membership for target organization within transaction
      await this.prisma.$transaction(async (tx) => {
        await tx.membership.upsert({
          where: {
            organizationId_userId: {
              organizationId,
              userId: existingUser.id,
            },
          },
          update: {
            status: 'ACTIVE',
            roleId,
          },
          create: {
            organizationId,
            userId: existingUser.id,
            roleId,
            status: 'ACTIVE',
          },
        });

        await this.redis.del(redisKey);
      });
    } else {
      // New user or uninitialized invitation account: initialize credentials
      const passwordHash = await this.passwordService.hash(dto.password);

      const user = await this.prisma.$transaction(async (tx) => {
        const u = await tx.user.upsert({
          where: { email },
          update: {
            passwordHash,
            status: 'ACTIVE',
            firstName: dto.firstName || 'Team',
            lastName: dto.lastName || 'Member',
          },
          create: {
            email,
            passwordHash,
            status: 'ACTIVE',
            firstName: dto.firstName || 'Team',
            lastName: dto.lastName || 'Member',
          },
        });

        await tx.membership.upsert({
          where: {
            organizationId_userId: {
              organizationId,
              userId: u.id,
            },
          },
          update: {
            status: 'ACTIVE',
            roleId,
          },
          create: {
            organizationId,
            userId: u.id,
            roleId,
            status: 'ACTIVE',
          },
        });

        await this.redis.del(redisKey);
        return u;
      });

      resolvedUserId = user.id;
    }

    await this.auditService.log({
      action: 'auth:accept_invite:success',
      actorId: resolvedUserId,
      organizationId,
      resourceType: 'User',
      resourceId: resolvedUserId,
      result: 'SUCCESS',
    });

    return { success: true, message: 'Invitation accepted and account activated successfully.' };
  }
}
