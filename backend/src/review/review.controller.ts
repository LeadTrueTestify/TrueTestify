import { Controller, Post, Param, Body, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/review.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/public')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post(':slug/reviews')
  @UseInterceptors(FileInterceptor('media'))
  async createReview(
    @Param('slug') slug: string,
    @Body() dto: CreateReviewDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.reviewService.createReview(slug, dto, file);
  }

  @Post(':slug/reviews/:reviewId/chunk')
  @UseInterceptors(FileInterceptor('chunk'))
  async uploadChunk(
    @Param('slug') slug: string,
    @Param('reviewId') reviewId: string,
    @UploadedFile() chunk: Express.Multer.File,
    @Query('chunkIndex') chunkIndex: number,
  ) {
    return this.reviewService.uploadChunk(slug, reviewId, chunk, chunkIndex);
  }

  @Post(':slug/reviews/:reviewId/finalize')
  async finalizeUpload(
    @Param('slug') slug: string,
    @Param('reviewId') reviewId: string,
    @Query('type') type: string,
  ) {
    return this.reviewService.finalizeUpload(slug, reviewId, type);
  }
}