import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express'; // For context

/**
 * Service for business operations.
 * Enforces multi-tenant: always filter by business_id.
 */
@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  // Public: Get business profile by slug (no auth required)
  async getPublicProfile(slug: string) {
    const business = await this.prisma.business.findUnique({
      where: { slug },
      select: { id: true, name: true, logoUrl: true, brandColor: true, website: true, contactEmail: true },
    });
    if (!business) throw new NotFoundException('Business not found');
    return { ...business, reviews: [] }; // Empty state for reviews
  }

  // Private: Get my business profile (auth required)
  async getMyProfile(request: Request) {
    const user = request.user as { businessId: string }; // From JWT
    if (!user?.businessId) throw new ForbiddenException('No business access');

    return this.prisma.business.findUnique({
      where: { id: user.businessId },
      select: { id: true, name: true, slug: true, logoUrl: true, brandColor: true, website: true, contactEmail: true },
    });
  }

  // Update profile (stub for now, can add in later milestones)
  // async updateProfile(...) {}
}