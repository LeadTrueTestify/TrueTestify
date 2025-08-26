import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VideoAssetsService } from './media/video-assets.service';
import { AudioAssetsService } from './media/audio-assets.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService, // inject S3 storage
    private readonly videoAssets: VideoAssetsService,
    private readonly audioAssets: AudioAssetsService,
  ) {}

  async submit(
    slug: string,
    dto: CreateReviewDto,
    file: Express.Multer.File | null,
    type: 'video' | 'audio' | 'text',
  ) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    if (!dto.consent) throw new BadRequestException('Consent is required');
    if (dto.durationSec && Number(dto.durationSec) > 60) {
      throw new BadRequestException('Maximum allowed duration is 60 seconds');
    }

    let videoId: string | undefined;
    let audioId: string | undefined;
    let videoUrl: string | undefined;
    let audioUrl: string | undefined;

    // 🎯 Decide based on `type`
    if (type === 'video') {
      if (!file) throw new BadRequestException('Video file is required');

      const videoKey = `video/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
      videoUrl = await this.storage.uploadFile(
        videoKey,
        file.buffer,
        file.mimetype,
      );

      const video = await this.videoAssets.create(tenant.id, {
        s3Key: videoKey,
        url: videoUrl,
      });
      videoId = video.id;
    }

    if (type === 'audio') {
      if (!file) throw new BadRequestException('Audio file is required');

      const audioKey = `audio/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
      audioUrl = await this.storage.uploadFile(
        audioKey,
        file.buffer,
        file.mimetype,
      );

      const audio = await this.audioAssets.create(tenant.id, {
        s3Key: audioKey,
        url: audioUrl,
      });
      audioId = audio.id;
    }

    let text = dto.text || null;
    let textStatus = text
      ? tenant.allowTextReviews
        ? 'APPROVED'
        : 'PENDING'
      : '';

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

    // ✅ Return response including AWS file URLs
    return {
      id: review.id,
      status: review.status,
      type,
      videoUrl,
      audioUrl,
    };
  }

  async getReviewsByTenant(tenantId: string, status?: string) {
  const reviews = await this.prisma.review.findMany({
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

  return JSON.parse(
    JSON.stringify(reviews, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    ),
  );
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
      include: {
        video: {
          select: { url: true },
        },
        audio: {
          select: { url: true },
        },
      },
    });
  }
}
