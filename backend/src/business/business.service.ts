import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async getPublicProfile(slug: string) {
    const business = await this.prisma.business.findUnique({
      where: { 
        slug,
        deletedAt: null,
      },
      select: { 
        id: true, 
        slug: true,
        name: true, 
        logoUrl: true, 
        brandColor: true, 
        website: true, 
        contactEmail: true,
        settingsJson: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!business) throw new NotFoundException('Business not found');
    return { 
      ...business, 
      reviews: [],
    };
  }

  async getMyProfile(request: Request) {
    console.log(request.user);
    
    const user = request.user as { sub: string; email: string; businessId: string };
    console.log(user.businessId);
    
    if (!user?.businessId) throw new ForbiddenException('No business access');

    const business = await this.prisma.business.findUnique({
      where: { 
        id: user.businessId,
        deletedAt: null,
      },
      select: { 
        id: true, 
        slug: true,
        name: true, 
        logoUrl: true, 
        brandColor: true, 
        website: true, 
        contactEmail: true,
        settingsJson: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!business) throw new NotFoundException('Business not found');
    return business;
  }
}