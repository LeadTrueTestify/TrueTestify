import { Controller, Get, Param, Patch, HttpCode } from '@nestjs/common';
import { UsageService } from './usage.service';

@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  /**
   * Snapshots and returns the current usage for a tenant, including total review views.
   * @param tenantId The tenant ID.
   */
  @Get(':tenantId/snapshot')
  async snapshotUsage(@Param('tenantId') tenantId: string) {
    return this.usageService.snapshotUsage(tenantId);
  }

  /**
   * Retrieves the view count for each individual widget for a given tenant.
   * @param tenantId The tenant ID.
   */
  @Get(':tenantId/widgets/views')
  async getWidgetViews(@Param('tenantId') tenantId: string) {
    return this.usageService.getWidgetViews(tenantId);
  }

  /**
   * Gets a detailed usage report for a tenant, including breakdown of review views by type and widget views.
   * @param tenantId The tenant ID.
   */
  @Get(':tenantId/detailed-usage')
  async getDetailedUsage(@Param('tenantId') tenantId: string) {
    return this.usageService.getDetailedUsage(tenantId);
  }

  /**
   * Retrieves the view counts for reviews, categorized by review type.
   * @param tenantId The tenant ID.
   */
  @Get(':tenantId/reviews/views-by-type')
  async getReviewViewsByType(@Param('tenantId') tenantId: string) {
    return this.usageService.getReviewViewsByType(tenantId);
  }

  /**
   * Increments the view count for a specific review.
   * @param reviewId The ID of the review to update.
   */
  @Patch('reviews/:reviewId/view')
  @HttpCode(204)
  async incrementReviewViews(@Param('reviewId') reviewId: string) {
    await this.usageService.incrementReviewViews(reviewId);
  }

  /**
   * Increments the view count for a specific widget.
   * @param widgetId The ID of the widget to update.
   */
  @Patch('widgets/:widgetId/view')
  @HttpCode(204)
  async incrementWidgetViews(@Param('widgetId') widgetId: string) {
    await this.usageService.incrementWidgetViews(widgetId);
  }
}
