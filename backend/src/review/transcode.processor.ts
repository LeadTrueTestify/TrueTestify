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
  async transcode(job: Job<{ businessId: string; reviewId: string; inputAssetId: string; target: string }>) {
    const { businessId, reviewId, inputAssetId, target } = job.data;

    const business = await this.prisma.business.findUnique({
      where: { id: businessId, deletedAt: null },
    });
    if (!business) {
      throw new Error('Business not found');
    }

    const mediaAsset = await this.prisma.mediaAsset.findUnique({
      where: { id: inputAssetId, reviewId, deletedAt: null },
    });
    if (!mediaAsset) {
      throw new Error('Media asset not found');
    }

    const s3Key = mediaAsset.s3Key;
    const outputKey = `${mediaAsset.s3Key.replace(/^(reviews\/(video|audio)\/)/, '$1processed/')}`;
    
    // Perform transcoding (placeholder; implement with ffmpeg or AWS Elastic Transcoder)
    console.log(`Transcoding ${s3Key} to ${outputKey} for target ${target}`);

    // Copy file to processed location
    await this.storageService.copyFile(s3Key, outputKey, business.slug, business.slug);

    // Update TranscodeJob status
    await this.prisma.transcodeJob.update({
      where: { id: job.id.toString() },
      data: { status: 'completed' },
    });
  }
}