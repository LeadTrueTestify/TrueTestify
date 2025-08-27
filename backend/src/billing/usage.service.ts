import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculates the current usage metrics for a given tenant.
   * @param tenantId The ID of the tenant.
   * @returns An object with storage bytes, active widgets, and review count.
   */
  async snapshotUsage(tenantId: string) {
    const [videos, activeWidgets, reviewsCount] = await Promise.all([
      // Sum the size of all video assets for the tenant.
      this.prisma.videoAsset.findMany({ where: { tenantId } }),
      // Count the number of active widgets for the tenant.
      this.prisma.widget.count({ where: { tenantId, isActive: true } }),
      // Count the total number of reviews.
      this.prisma.review.count({ where: { tenantId } }),
    ])
    // Calculate the total storage in bytes.
    const storageBytes = videos.reduce((acc, v) => acc + Number(v.sizeBytes || 0), 0)
    // Return the usage metrics for billing.
    return { storageBytes, activeWidgets, reviewsCount }
  }
}