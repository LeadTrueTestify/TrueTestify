import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VideoAssetsService } from './media/video-assets.service';
import { AudioAssetsService } from './media/audio-assets.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private videoAssets: VideoAssetsService,
    private audioAssets: AudioAssetsService,
  ) {}

  async submit(slug: string, dto: CreateReviewDto) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    // Enforce consent and 60-second limit per MVP
    if (!dto.consent) {
      throw new BadRequestException('Consent is required to submit a review');
    }
    if (dto.durationSec && Number(dto.durationSec) > 60) {
      throw new BadRequestException('Maximum allowed duration is 60 seconds');
    }

    let videoId: string | undefined;
    if (dto.videoS3Key) {
      const video = await this.videoAssets.create(tenant.id, {
        ...dto,
        s3Key: dto.videoS3Key,
      });
      videoId = video.id;
    }

    let audioId: string | undefined;
    if (dto.audioS3Key) {
      const audio = await this.audioAssets.create(tenant.id, {
        ...dto,
        s3Key: dto.audioS3Key,
      });
      audioId = audio.id;
    }
    let text = dto.text || null;
    let textStatus = 'PENDING';
    if (text) {
      if (!tenant.allowTextReviews) {
        // text allowed but only after admin approval
        textStatus = 'PENDING';
      } else {
        // text reviews auto-approved if tenant allows
        textStatus = 'APPROVED';
      }
    }
    const review = await this.prisma.review.create({
      data: {
        tenantId: tenant.id,
        title: dto.title,
        authorName: dto.authorName,
        authorEmail: dto.authorEmail,
        consent: !!dto.consent,
        videoId,
        audioId,
        text,
        textStatus,
        status: 'PENDING',
        durationSec: dto.durationSec || null,
        previewUrl: dto.previewUrl || null,
      },
    });

    await this.prisma.analyticsEvent.create({
      data: {
        tenantId: tenant.id,
        type: 'REVIEW_SUBMITTED',
        meta: { reviewId: review.id },
      },
    });

    return { id: review.id, status: review.status };
  }

  async getReviewsByTenant(tenantId: string, status?: string) {
    return this.prisma.review.findMany({
      where: {
        tenantId,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        video: true,
        audio: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        video: true,
        audio: true,
        tenant: true,
      },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async updateReview(id: string, dto: any) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.update({
      where: { id },
      data: {
        title: dto.title,
        authorName: dto.authorName,
        authorEmail: dto.authorEmail,
        text: dto.text,
      },
      include: {
        video: true,
        audio: true,
      },
    });
  }
  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }
  async moderate(
    id: string,
    action: 'APPROVE' | 'REJECT' | 'HIDE' | 'DELETE',
    type: 'MEDIA' | 'TEXT' = 'MEDIA',
  ) {
    const status =
      action === 'APPROVE'
        ? 'APPROVED'
        : action === 'REJECT'
          ? 'REJECTED'
          : action === 'DELETE'
            ? 'DELETED'
            : 'HIDDEN';

    if (type === 'TEXT') {
      console.log('Updating TEXT status:', id, status);
      return this.prisma.review.update({
        where: { id },
        data: { textStatus: status },
      });
    }
     if (action === 'DELETE') {
      console.log('Updating DELETE REVIEW:', id, status);
      return this.prisma.review.delete({
        where: { id },
      });
    }
    return this.prisma.review.update({
      where: { id },
      data: { status },
    });
    
  }

  async list(id: string, status?: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return this.prisma.review.findMany({
      where: {
        tenantId: tenant.id,
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
