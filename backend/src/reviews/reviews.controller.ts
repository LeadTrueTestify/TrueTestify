import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private svc: ReviewsService) {}

  @Post(':tenantSlug')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async submitReview(
    @Param('tenantSlug') tenantSlug: string,
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      audio?: Express.Multer.File[];
    },
    @Body() body: CreateReviewDto & { type: 'video' | 'audio' | 'text' },
  ) {
    const { type, text } = body;

    if (!type || !['video', 'audio', 'text'].includes(type)) {
      throw new BadRequestException(
        'Invalid type. Must be "video", "audio" or "text"',
      );
    }

    if (type === 'text') {
      if (!text || text.trim() === '') {
        throw new BadRequestException('Text is required for type: text');
      }
      return this.svc.submit(tenantSlug, body, null, 'text'); // no file
    }

    const file = type === 'video' ? files?.video?.[0] : files?.audio?.[0];

    if (!file) {
      throw new BadRequestException(`File is required for type: ${type}`);
    }

    return this.svc.submit(tenantSlug, body, file, type);
  }

  // Protected endpoints for admin dashboard
  @UseGuards(JwtAuthGuard)
  @Get('tenant/:tenantId')
  getReviewsByTenant(
    @Param('tenantId') tenantId: string,
    @Query('status') status?: string,
  ) {
    return this.svc.getReviewsByTenant(tenantId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getReview(@Param('id') id: string) {
    return this.svc.getReview(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateReview(@Param('id') id: string, @Body() dto: any) {
    return this.svc.updateReview(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/approved')
  approveReview(@Param('id') id: string) {
    return this.svc.moderate(id, 'APPROVE');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/rejected')
  rejectReview(@Param('id') id: string) {
    return this.svc.moderate(id, 'REJECT');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deleted')
  deleteReview(@Param('id') id: string) {
    return this.svc.moderate(id, 'DELETE');
  }

  // Moderation endpoints (token/role validation can be added via guard in real app)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/moderate')
  moderate(
    @Param('id') id: string,
    @Body('action') action: 'APPROVE' | 'REJECT' | 'HIDE' | 'DELETE',
    @Body('type') type: 'MEDIA' | 'TEXT' = 'MEDIA',
  ) {
    return this.svc.moderate(id, action, type);
  }

  @Get(':tenantSlug/list')
  list(@Param('tenantSlug') slug: string, @Query('status') status?: string) {
    return this.svc.list(slug, status);
  }
}
