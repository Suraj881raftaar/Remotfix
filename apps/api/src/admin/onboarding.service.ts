import { BadRequestException, Injectable } from '@nestjs/common';
import { PasswordService } from '../common/crypto/password.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';

export interface ProvisionTenantInput {
  organizationName: string;
  organizationSlug: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerFirstName: string;
  ownerLastName: string;
}

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly auditService: AuditService
  ) {}

  /**
   * Controlled operator provisioning for initial organization and root OWNER (D-M4-05 Option B).
   * Unrestricted public self-registration is strictly prohibited.
   */
  async provisionOrganizationWithOwner(input: ProvisionTenantInput) {
    const email = input.ownerEmail.trim().toLowerCase();
    const slug = input.organizationSlug.trim().toLowerCase();

    // 1. Check if organization slug exists
    const existingOrg = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      throw new BadRequestException(`Organization with slug '${slug}' already exists`);
    }

    // 2. Resolve OWNER system role
    const ownerRole = await this.prisma.role.findFirst({
      where: {
        name: 'OWNER',
        isSystem: true,
        organizationId: null,
      },
    });

    if (!ownerRole) {
      throw new BadRequestException('OWNER system role not found in RBAC catalog');
    }

    // 3. Hash password using Argon2id (D-M4-02)
    const passwordHash = await this.passwordService.hash(input.ownerPassword);

    // 4. Create Organization and Owner within transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: input.organizationName,
          slug,
          status: 'ACTIVE',
        },
      });

      // Locked Decision 1: NEVER overwrite password, firstName, or lastName for existing users
      const existingUser = await tx.user.findUnique({ where: { email } });
      const user =
        existingUser ||
        (await tx.user.create({
          data: {
            email,
            passwordHash,
            status: 'ACTIVE',
            firstName: input.ownerFirstName,
            lastName: input.ownerLastName,
          },
        }));

      const membership = await tx.membership.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          roleId: ownerRole.id,
          status: 'ACTIVE',
        },
      });

      return {
        organization,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        membership,
      };
    });

    await this.auditService.log({
      action: 'organization:provisioned',
      actorId: result.user.id,
      organizationId: result.organization.id,
      resourceType: 'Organization',
      resourceId: result.organization.id,
      result: 'SUCCESS',
      metadata: {
        ownerEmail: email,
        slug,
        provisionType: 'CONTROLLED_ONBOARDING',
      },
    });

    return result;
  }
}
