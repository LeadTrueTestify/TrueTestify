import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateReviewDto } from './dto/review.dto';
import { v4 as uuidv4 } from 'uuid';
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    @InjectQueue('transcode') private transcodeQueue: Queue,
  ) {}

  async createReview(slug: string, dto: CreateReviewDto, file?: Express.Multer.File) {
    // Define allowed mimetypes
    const allowedVideoMimetypes = ['video/webm', 'video/mp4', 'video/quicktime',"video/webm;codecs=vp8,opus"];
    const allowedAudioMimetypes = ['audio/webm', 'audio/mpeg', 'audio/wav'];

    // Validate consent
    if (!dto.consentChecked) {
      throw new BadRequestException('Consent is mandatory');
    }

    // Validate type
    if (!['video', 'audio', 'text'].includes(dto.type)) {
      throw new BadRequestException('Type must be video, audio, or text');
    }

    // Validate text reviews
    if (dto.type === 'text' && !dto.bodyText) {
      throw new BadRequestException('Body text is required for text reviews');
    }

    // Validate file presence for video/audio
    if (dto.type !== 'text' && !file) {
      throw new BadRequestException('File is required for video or audio reviews');
    }

    // Normalize mimetype (remove codec information)
    const normalizeMimetype = (mimetype: string) => mimetype.split(';')[0];

    // Validate file mimetype
    if (dto.type === 'video' && file) {
      console.log('Video file mimetype:', file.mimetype); // Debug log
      const normalizedMimetype = normalizeMimetype(file.mimetype);
      const isValidVideo = allowedVideoMimetypes.includes(normalizedMimetype);
      if (!isValidVideo) {
        throw new BadRequestException(`File must be one of: ${allowedVideoMimetypes.join(', ')}`);
      }
    }
    if (dto.type === 'audio' && file) {
      console.log('Audio file mimetype:', file.mimetype); // Debug log
      const normalizedMimetype = normalizeMimetype(file.mimetype);
      const isValidAudio = allowedAudioMimetypes.includes(normalizedMimetype);
      if (!isValidAudio) {
        throw new BadRequestException(`File must be one of: ${allowedAudioMimetypes.join(', ')}`);
      }
    }

    // Validate business
    const business = await this.prisma.business.findUnique({
      where: { slug, deletedAt: null },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        businessId: business.id,
        type: dto.type,
        title: dto.title,
        bodyText: dto.type === 'text' ? dto.bodyText : null,
        rating: dto.rating,
        reviewerName: dto.reviewerName,
        reviewerContactJson: dto.reviewerContactJson || {},
        consentChecked: dto.consentChecked,
        source: dto.source || 'website',
        submittedAt: new Date(),
        status: 'pending',
      },
    });

    // Handle file upload for video/audio
    if (dto.type !== 'text' && file) {
      const normalizedMimetype = normalizeMimetype(file.mimetype);
      const fileExtension = normalizedMimetype.includes('webm') ? 'webm' :
                           normalizedMimetype.includes('mp4') ? 'mp4' :
                           normalizedMimetype.includes('quicktime') ? 'mov' :
                           normalizedMimetype.includes('mpeg') ? 'mp3' : 'wav';
      const s3Key = `reviews/${dto.type}/${dto.type}-${uuidv4()}.${fileExtension}`;
      const fileUrl = await this.storageService.uploadFile(file, s3Key, business.slug);

      const mediaAsset = await this.prisma.mediaAsset.create({
        data: {
          businessId: business.id,
          reviewId: review.id,
          assetType: file.mimetype, // Retain full mimetype for accuracy
          s3Key,
          durationSec: 30, // Placeholder; calculate in production
          sizeBytes: file.size,
          metadataJson: {},
        },
      });

      // Add to transcode queue
      await this.transcodeQueue.add({
        businessId: business.id,
        reviewId: review.id,
        inputAssetId: mediaAsset.id,
        target: dto.type === 'video' ? '720p' : 'audio_mp3',
        inputFormat: fileExtension,
      });
    }

    return {
      reviewId: review.id,
      status: 'pending',
      message: dto.type === 'text' ? 'Text review submitted' : 'Review submitted and transcoding queued',
    };
  }

  async getReview(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId, deletedAt: null },
      include: {
        mediaAssets: true,
      },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const reviewUrl = review.mediaAssets.length > 0 ? review.mediaAssets[0].s3Key : null;

    return {
      ...review,
      reviewUrl,
    };
  }
}