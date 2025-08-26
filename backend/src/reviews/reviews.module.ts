import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { StorageModule } from '../storage/storage.module';
import { VideoAssetsService } from './media/video-assets.service';
import { AudioAssetsService } from './media/audio-assets.service';
import { StorageService } from 'src/storage/storage.service';
@Module({
  imports: [StorageModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, VideoAssetsService, AudioAssetsService,StorageService],
})
export class ReviewsModule {}
