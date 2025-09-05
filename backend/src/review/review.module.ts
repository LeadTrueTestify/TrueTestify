import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { BullModule } from '@nestjs/bull';
import { TranscodeProcessor } from './transcode.processor';
import { StorageService } from '../storage/storage.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transcode',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      },
    }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, TranscodeProcessor, StorageService, PrismaService,ConfigService],
})
export class ReviewModule {}