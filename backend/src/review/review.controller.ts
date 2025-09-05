import { Controller, Post, Get, Param, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/review.dto';

@Controller('api/public')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post(':slug/reviews')
  @UseInterceptors(FileInterceptor('file'))
  async createReview(
    @Param('slug') slug: string,
    @Body() dto: CreateReviewDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!dto.consentChecked) {
      throw new BadRequestException('Consent is mandatory');
    }
    return this.reviewService.createReview(slug, dto, file);
  }

  @Get('reviews/:reviewId')
  async getReview(@Param('reviewId') reviewId: string) {
    return this.reviewService.getReview(reviewId);
  }
}