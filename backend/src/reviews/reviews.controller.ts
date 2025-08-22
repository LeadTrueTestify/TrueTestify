import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private svc: ReviewsService) {}

  // Public endpoint for widget or public page
  @Post(':tenanId')
  submit(@Param('tenanId') id: string, @Body() dto: CreateReviewDto) {
    return this.svc.submit(id, dto);
  }

  // Protected endpoints for admin dashboard
  @UseGuards(JwtAuthGuard)
  @Get('tenant/:tenantId')
  getReviewsByTenant(@Param('tenantId') tenantId: string, @Query('status') status?: string) {
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
