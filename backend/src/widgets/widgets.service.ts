import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class WidgetsService {
  constructor(private prisma: PrismaService) {}

  async widgetFeed(slug: string, layout: 'GRID' | 'CAROUSEL' | 'SPOTLIGHT' | 'WALL' = 'GRID') {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } })
    if (!tenant) throw new NotFoundException('Tenant not found')

    const reviews = await this.prisma.review.findMany({
      where: { tenantId: tenant.id, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { video: true },
    })

    const items = reviews.map(r => ({
      id: r.id,
      title: r.title,
      authorName: r.authorName,
      videoUrl: r.video?.url,
      previewUrl: r.previewUrl,
      durationSec: r.durationSec,
    }))

    switch (layout) {
      case 'CAROUSEL':
        return this.buildCarousel(tenant, items)
      case 'SPOTLIGHT':
        return this.buildSpotlight(tenant, items)
      case 'WALL':
        return this.buildWall(tenant, items)
      case 'GRID':
      default:
        return this.buildGrid(tenant, items)
    }
  }

  private buildGrid(tenant: any, items: any[]) {
    return {
      type: 'GRID',
      tenant: this.tenantMeta(tenant),
      items,
    }
  }

  private buildCarousel(tenant: any, items: any[]) {
    return {
      type: 'CAROUSEL',
      tenant: this.tenantMeta(tenant),
      items, // frontend will render as horizontal slider
    }
  }

  private buildSpotlight(tenant: any, items: any[]) {
    return {
      type: 'SPOTLIGHT',
      tenant: this.tenantMeta(tenant),
      featured: items[0] || null, // show first one as spotlight
      others: items.slice(1),
    }
  }

  private buildWall(tenant: any, items: any[]) {
    return {
      type: 'WALL',
      tenant: this.tenantMeta(tenant),
      items, // frontend will render as masonry / continuous wall
    }
  }

  private tenantMeta(tenant: any) {
    return {
      name: tenant.name,
      logoUrl: tenant.logoUrl,
      brandPrimaryHex: tenant.brandPrimaryHex,
      brandAccentHex: tenant.brandAccentHex,
    }
  }
}
