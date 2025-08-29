import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async getBySlug(id: string) {
    const findSlug = await this.prisma.tenant.findUnique({ where: { id } });
    if (!findSlug) throw new BadRequestException('Tenant not found');
    return findSlug;
  }

  update(id: string, data: any) {
    const userId = this.prisma.tenant.update({ where: { id }, data });
    if (!userId) throw new NotFoundException('Failed to update tenant');
    return userId;
  }

  /**
   * Creates and stores a new API key hash in the database, returning the raw key to the user.
   *
   * @param tenantId The ID of the tenant the key belongs to.
   * @param userId The ID of the user who created the key.
   * @returns An object containing the raw API key string and the database ID.
   */
  async createApiKey(tenantId: string, userId: string) {
    const raw = `tt_${randomBytes(24).toString('hex')}`;
    const keyHash = createHash('sha256').update(raw).digest('hex');

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId,
        tenantId,
        keyHash,
        label: 'Default',
      },
    });

    if (!apiKey) {
      // While `prisma.create` is unlikely to fail in this way,
      // it's good practice to handle potential issues.
      throw new ConflictException('Failed to create API key');
    }

    return { apiKey: raw, id: apiKey.id };
  }


}
