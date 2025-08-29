import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * @name UsageService
 * @description
 * This service is responsible for calculating and providing
 * various usage metrics for a given tenant, such as storage,
 * widget counts (active and inactive), and total reviews.
 */
@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculates the current usage metrics for a given tenant.
   * This provides a complete snapshot for billing or analytics.
   * @param tenantId The ID of the tenant.
   * @returns An object with total storage in bytes, total reviews,
   * total review views, and counts for both active and inactive widgets.
   */
  async snapshotUsage(tenantId: string) {
    const [
      videos, 
      reviewsCount, 
      activeWidgetsCount, 
      inactiveWidgetsCount, 
      totalReviewViews
    ] = await Promise.all([
      // Sum the size of all video assets for the tenant.
      this.prisma.videoAsset.findMany({ where: { tenantId } }),
      
      // Count the total number of reviews.
      this.prisma.review.count({ where: { tenantId } }),
      
      // Count the number of active widgets.
      this.prisma.widget.count({ where: { tenantId, isActive: true } }),
      
      // Count the number of inactive widgets.
      this.prisma.widget.count({ where: { tenantId, isActive: false } }),

      // Sum the views for all reviews.
      this.prisma.review.aggregate({
        _sum: {
          viewsCount: true,
        },
        where: { tenantId },
      }),
    ]);

    // Calculate the total storage in bytes.
    const storageBytes = videos.reduce((acc, v) => acc + Number(v.sizeBytes || 0), 0);
    
    // Return the comprehensive usage metrics for billing.
    return { 
      storageBytes, 
      reviewsCount, 
      activeWidgetsCount,
      inactiveWidgetsCount,
      totalReviewViews: totalReviewViews._sum.viewsCount || 0,
    };
  }

  /**
   * Retrieves the view count for each individual widget for a given tenant.
   * @param tenantId The ID of the tenant.
   * @returns An array of objects, each containing a widget's ID, name, and view count.
   */
  async getWidgetViews(tenantId: string) {
    const widgets = await this.prisma.widget.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        // Include reviews to sum their views
        reviews: {
          select: {
            viewsCount: true,
          },
        },
      },
    });

    return widgets.map((widget) => ({
      id: widget.id,
      name: widget.name,
      viewsCount: widget.reviews.reduce((acc, review) => acc + (review.viewsCount || 0), 0),
    }));
  }
  
  /**
   * Increments the view count for a specific review.
   * @param reviewId The ID of the review to update.
   */
  async incrementReviewViews(reviewId: string) {
    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });

    if (!updatedReview) {
      throw new NotFoundException(`Review with ID ${reviewId} not found.`);
    }
  }

  /**
   * Gets a detailed usage report for a tenant, including breakdown of review views by type and widget views.
   * @param tenantId The ID of the tenant.
   * @returns A detailed usage report.
   */
  async getDetailedUsage(tenantId: string) {
    const [
      reviews,
      widgets,
    ] = await Promise.all([
      // Get all reviews with their views and type
      this.prisma.review.findMany({ 
        where: { tenantId },
      }),
      // Get all widgets with their views and status
      this.prisma.widget.findMany({
        where: { tenantId },
        select: {
          id: true,
          name: true,
          viewsCount: true,
          isActive: true,
        },
      }),
    ]);

    // Aggregate review views by type
    const reviewViewsByType = reviews.reduce((acc, review) => {
      // Assuming 'type' is a field on the Review model (e.g., 'VIDEO', 'AUDIO', 'TEXT')
      const type = (review as any).type?.toLowerCase(); // Use 'as any' to bypass TS error if `type` isn't in Prisma schema. You should add this field to the schema.
      if (type) {
        acc[type] = (acc[type] || 0) + (review.viewsCount || 0);
      }
      return acc;
    }, {});

    // Calculate other metrics
    const reviewsCount = reviews.length;
    const activeWidgetsCount = widgets.filter(w => w.isActive).length;
    const inactiveWidgetsCount = widgets.filter(w => !w.isActive).length;
    const totalReviewViews = reviews.reduce((acc, review) => acc + (review.viewsCount || 0), 0);

    return {
      reviewsCount,
      activeWidgetsCount,
      inactiveWidgetsCount,
      totalReviewViews,
      reviewViewsByType,
      widgets: widgets.map(w => ({
        id: w.id,
        name: w.name,
        viewsCount: w.viewsCount,
      })),
    };
  }

  /**
   * Increments the view count for a specific widget.
   * @param widgetId The ID of the widget to update.
   */
  async incrementWidgetViews(widgetId: string) {
    const updatedWidget = await this.prisma.widget.update({
      where: { id: widgetId },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });

    if (!updatedWidget) {
      throw new NotFoundException(`Widget with ID ${widgetId} not found.`);
    }
  }
  async getReviewViewsByType(tenantId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { tenantId },
      select: {
        videoId: true,
        audioId: true,
        text: true,
        viewsCount: true,
      },
    });

    const viewsByType = reviews.reduce(
      (acc, review) => {
        if (review.videoId) {
          acc.video = (acc.video || 0) + (review.viewsCount || 0);
        } else if (review.audioId) {
          acc.audio = (acc.audio || 0) + (review.viewsCount || 0);
        } else if (review.text) {
          acc.text = (acc.text || 0) + (review.viewsCount || 0);
        }
        return acc;
      },
      { video: 0, audio: 0, text: 0 },
    );

    return viewsByType;
  }
}
