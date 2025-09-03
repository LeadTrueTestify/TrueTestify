import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateReviewDto } from './dto/review.dto';
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { randomUUID } from 'crypto';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    @InjectQueue('transcode') private transcodeQueue: Queue,
  ) {}

  async createReview(slug: string, dto: CreateReviewDto, file?: Express.Multer.File) {
    // Validate consent
    if (!dto.consentChecked) {
      throw new BadRequestException('Consent is required');
    }

    // Resolve business_id from slug
    const business = await this.prisma.business.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true, name: true },
    });
    if (!business) throw new NotFoundException('Business not found');

    // Validate file and media limits
    if (!file) throw new BadRequestException('Media file is required');
    if (!['video', 'audio'].includes(dto.type)) {
      throw new BadRequestException('Type must be video or audio');
    }

    // Validate duration and size (simplified; actual validation requires metadata extraction)
    const maxDurationSec = 60;
    const maxSizeBytes = 30 * 1024 * 1024; // 30MB for 60s at ~2Mbps
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('File size exceeds 30MB limit');
    }

    // Create review (pending status)
    const review = await this.prisma.review.create({
      data: {
        businessId: business.id,
        type: dto.type,
        status: 'pending',
        title: dto.title,
        bodyText: dto.bodyText,
        rating: dto.rating,
        reviewerName: dto.reviewerName,
        consentChecked: dto.consentChecked,
        source: 'website',
        submittedAt: new Date(),
      },
      select: {
        id: true,
        businessId: true,
        type: true,
        status: true,
        submittedAt: true,
      },
    });

    // Upload file to S3 (tenant-scoped)
    const s3Key = `truetestify/${business.id}/reviews/${review.id}/${dto.type}-${randomUUID()}.${file.mimetype.split('/')[1]}`;
    const s3Url = await this.storageService.uploadFile(file, s3Key);

    // Create media asset
    const mediaAsset = await this.prisma.mediaAsset.create({
      data: {
        businessId: business.id,
        reviewId: review.id,
        assetType: dto.type,
        s3Key,
        sizeBytes: file.size,
        metadataJson: {}, // Placeholder; update with actual metadata post-transcoding
        durationSec: 0, // Placeholder; update post-transcoding
      },
      select: { id: true, s3Key: true },
    });

    // Enqueue transcode job
    await this.transcodeQueue.add({
      businessId: business.id,
      reviewId: review.id,
      inputAssetId: mediaAsset.id,
      s3Key,
      target: dto.type === 'video' ? '720p' : 'audio_mp3',
    });

    return {
      reviewId: review.id,
      status: review.status,
      message: 'Review submitted and pending transcoding',
    };
  }

  // Chunked upload endpoints (simplified; assumes client handles chunking)
  async uploadChunk(slug: string, reviewId: string, chunk: Express.Multer.File, chunkIndex: number) {
    const business = await this.prisma.business.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true },
    });
    if (!business) throw new NotFoundException('Business not found');

    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, businessId: business.id, deletedAt: null },
      select: { id: true },
    });
    if (!review) throw new NotFoundException('Review not found');

    // Store chunk temporarily (e.g., in S3 or local storage)
    const s3Key = `truetestify/${business.id}/reviews/${reviewId}/chunks/chunk-${chunkIndex}-${randomUUID()}`;
    await this.storageService.uploadFile(chunk, s3Key);

    return { chunkIndex, status: 'uploaded' };
  }

  async finalizeUpload(slug: string, reviewId: string, type: string) {
    const business = await this.prisma.business.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true },
    });
    if (!business) throw new NotFoundException('Business not found');

    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, businessId: business.id, deletedAt: null },
      select: { id: true, type: true, consentChecked: true },
    });
    if (!review) throw new NotFoundException('Review not found');
    if (!review.consentChecked) throw new BadRequestException('Consent not provided');
    if (review.type !== type) throw new BadRequestException('Invalid media type');

    // Assume chunks are combined into a single file (simplified; actual implementation requires merging)
    const s3Key = `truetestify/${business.id}/reviews/${reviewId}/${type}-${randomUUID()}.${type === 'video' ? 'mp4' : 'mp3'}`;
    const sizeBytes = 0; // Placeholder; calculate actual size after merging
    const mediaAsset = await this.prisma.mediaAsset.create({
      data: {
        businessId: business.id,
        reviewId: review.id,
        assetType: type,
        s3Key,
        sizeBytes,
        metadataJson: {},
        durationSec: 0,
      },
      select: { id: true, s3Key: true },
    });

    // Enqueue transcode job
    await this.transcodeQueue.add({
      businessId: business.id,
      reviewId: review.id,
      inputAssetId: mediaAsset.id,
      s3Key,
      target: type === 'video' ? '720p' : 'audio_mp3',
    });

    return { reviewId, status: 'finalized', message: 'Upload finalized, transcoding queued' };
  }
}