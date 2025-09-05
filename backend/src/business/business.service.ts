import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class BusinessService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async getPublicProfile(slug: string) {
    // Fetch business details and approved reviews with their media assets in a single transaction
    const [business, reviews] = await this.prisma.$transaction([
      this.prisma.business.findUnique({
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
        },
      }),
      this.prisma.review.findMany({
        where: {
          business: {
            slug,
            deletedAt: null,
          },
          status: 'approved',
          deletedAt: null,
        },
        select: {
          id: true,
          type: true,
          title: true,
          bodyText: true,
          rating: true,
          reviewerName: true,
          submittedAt: true,
          mediaAssets: {
            where: {
              deletedAt: null, // Only include media assets that haven't been deleted
            },
            select: {
              s3Key: true,
            },
          },
        },
        orderBy: {
          submittedAt: 'desc', // Show newest reviews first
        },
      }),
    ]);

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Process reviews to add the 'reviewUrl' field for consistency
    const reviewsWithMedia = reviews.map((review) => {
      const reviewUrl =
        review.mediaAssets.length > 0 ? review.mediaAssets[0].s3Key : null;
      return {
        ...review,
        reviewUrl,
      };
    });

    return {
      business,
      reviews: reviewsWithMedia,
    };
  }

  async getMyProfile(request: Request) {
    const user = request.user as {
      sub: string;
      email: string;
      businessId: string;
    };
    if (!user?.businessId) throw new ForbiddenException('No business access');

    // Fetch business details, reviews, and review counts in a single transaction
    const [business, reviews, reviewCounts] = await this.prisma.$transaction([
      this.prisma.business.findUnique({
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
      }),
      // Fetch all reviews
      this.prisma.review.findMany({
        where: {
          businessId: user.businessId,
          deletedAt: null,
        },
        select: {
          id: true,
          type: true,
          title: true,
          bodyText: true,
          rating: true,
          reviewerName: true,
          submittedAt: true,
          status: true,
          mediaAssets: {
            where: {
              deletedAt: null, // Only include media assets that haven't been deleted
            },
            select: {
              s3Key: true,
            },
          },
        },
        orderBy: {
          submittedAt: 'desc', // Show newest reviews first
        },
      }),
      // Aggregate review counts by status
      this.prisma.review.groupBy({
        by: ['status'],
        where: {
          businessId: user.businessId,
          deletedAt: null,
        },
        _count: {
          status: true,
        },
        orderBy: [],
      }),
    ]);

    if (!business) throw new NotFoundException('Business not found');

    // Compute review counts
    const counts = {
      approved: 0,
      rejected: 0,
      pending: 0,
      total: 0,
    };

    reviewCounts.forEach((group) => {
      const status = group.status;
      const countObj =
        typeof group._count === 'object' && group._count !== null
          ? group._count
          : {};
      const statusCount =
        typeof countObj.status === 'number' ? countObj.status : 0;
      if (status === 'approved') counts.approved = statusCount;
      if (status === 'rejected') counts.rejected = statusCount;
      if (status === 'pending') counts.pending = statusCount;
      counts.total += statusCount;
    });

    return {
      business,
      reviews, // Array of individual reviews
      reviewCounts: counts, // Aggregated counts
    };
  }
  async updateMyProfile(
    request: Request,
    updateDto: {
      name: string;
      website?: string;
      brandColor?: string;
      logo?: Express.Multer.File;
    },
  ) {
    const user = request.user as {
      sub: string;
      email: string;
      businessId: string;
    };
    if (!user?.businessId) throw new ForbiddenException('No business access');

    // Validate required fields
    if (!updateDto.name)
      throw new BadRequestException('Business name is required');

    // Prepare update data

    // Handle logo upload
    let logoUrl: string | null = null;
    if (updateDto.logo) {
      const sanitizedFileName = updateDto.logo.originalname.replace(
        /\s+/g,
        '_',
      );
      
      logoUrl = await this.storageService.uploadFile(
        updateDto.logo,
        sanitizedFileName,
        process.env.AWS_S3_BUCKET as string,
      );
    }
    const updateData: any = {
      name: updateDto.name,
      website: updateDto.website || null,
      brandColor: updateDto.brandColor || null,
      logoUrl,
      updatedAt: new Date(),
    };
    // Update business in a transaction with fetching updated data
    const [updatedBusiness, reviews, reviewCounts] =
      await this.prisma.$transaction([
        this.prisma.business.update({
          where: {
            id: user.businessId,
            deletedAt: null,
          },
          data: updateData,
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
        }),
        this.prisma.review.findMany({
          where: {
            businessId: user.businessId,
            deletedAt: null,
          },
          select: {
            id: true,
            type: true,
            title: true,
            bodyText: true,
            rating: true,
            reviewerName: true,
            submittedAt: true,
            status: true,
          },
        }),
        this.prisma.review.groupBy({
          by: ['status'],
          where: {
            businessId: user.businessId,
            deletedAt: null,
          },
          _count: {
            status: true,
          },
          orderBy: [],
        }),
      ]);

    if (!updatedBusiness) throw new NotFoundException('Business not found');

    // Compute review counts
    const counts = {
      approved: 0,
      rejected: 0,
      pending: 0,
      total: 0,
    };

    reviewCounts.forEach((group) => {
      const status = group.status;
      const countObj =
        typeof group._count === 'object' && group._count !== null
          ? group._count
          : {};
      const statusCount =
        typeof countObj.status === 'number' ? countObj.status : 0;
      if (status === 'approved') counts.approved = statusCount;
      if (status === 'rejected') counts.rejected = statusCount;
      if (status === 'pending') counts.pending = statusCount;
      counts.total += statusCount;
    });

    return {
      business: updatedBusiness,
      reviews,
      reviewCounts: counts,
    };
  }
}
