import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { StorageService } from '../storage/storage.service';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('transcode')
export class TranscodeProcessor {
  constructor(
    private storageService: StorageService,
    private prisma: PrismaService,
  ) {}

  @Process()
  async transcode(job: Job<{
    businessId: string;
    reviewId: string;
    inputAssetId: string;
    s3Key: string;
    target: string;
  }>) {
    const { businessId, reviewId, inputAssetId, s3Key, target } = job.data;

    try {
      // Simplified transcoding logic (use FFmpeg or AWS Elastic Transcoder in production)
      const outputKey = s3Key.replace('reviews', 'reviews/processed');
      // Simulate transcoding: copy file to processed folder
      await this.storageService.copyFile(s3Key, outputKey);

      // Update media asset with metadata
      await this.prisma.mediaAsset.update({
        where: { id: inputAssetId, businessId, deletedAt: null },
        data: {
          metadataJson: {
            resolution: target === '720p' ? '1280x720' : null,
            bitrate: target === '720p' ? '1.5Mbps' : '128kbps',
          },
          durationSec: 30, // Placeholder; extract actual duration
        },
      });

      // Update transcode job status
      await this.prisma.transcodeJob.update({
        where: { id: job.id.toString(), businessId, deletedAt: null },
        data: { status: 'completed', updatedAt: new Date() },
      });
    } catch (error) {
      await this.prisma.transcodeJob.update({
        where: { id: job.id.toString(), businessId, deletedAt: null },
        data: { status: 'failed', error: error.message, updatedAt: new Date() },
      });
      throw error;
    }
  }
}