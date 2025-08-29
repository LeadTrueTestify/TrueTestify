import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WidgetsService {
  constructor(private prisma: PrismaService) {}

  // Create new widget
  async createWidget(tenantId: string, dto: any) {
    return this.prisma.widget.create({
      data: {
        tenantId,
        name: dto.name,
        layout: dto.layout,
        themeJson: dto.themeJson ?? {},
        isActive: dto.isActive ?? true,
      },
    });
  }

  // Update widget
  async updateWidget(widgetId: string, dto: any) {
    return this.prisma.widget.update({
      where: { id: widgetId },
      data: {
        name: dto.name,
        layout: dto.layout,
        themeJson: dto.themeJson ?? {},
        isActive: dto.isActive,
      },
    });
  }

  // Get all widgets for a tenant
  async listWidgets(tenantId: string) {
    return this.prisma.widget.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: { tenant: true }, // Include tenant data to get the slug
    });
  }

  // Get a single widget by ID
  async getWidgetById(widgetId: string) {
    return this.prisma.widget.findUnique({
      where: { id: widgetId },
      include: { tenant: true }, // Include tenant data
    });
  }

  // Get widget feed (public)
  async getWidgetFeed(tenantSlug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const widgets = await this.prisma.widget.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true, // Fetch only active widgets
      },
      include: { tenant: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!widgets.length) {
      throw new NotFoundException('No active widgets found for this tenant');
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        tenantId: tenant.id,
        status: 'APPROVED',
      },
      orderBy: { createdAt: 'desc' },
      include: { video: true, audio: true },
      take: 50,
    });

    const items = reviews.map((r) => ({
      id: r.id,
      authorName: r.authorName,
      title: r.title,
      text: r.text,
      videoUrl: r.video?.url,
      audioUrl: r.audio?.url,
      previewUrl: r.previewUrl,
      durationSec: r.durationSec,
    }));

    return {
      widgets: widgets.map(widget => ({
        id: widget.id,
        name: widget.name,
        layout: widget.layout,
        themeJson: widget.themeJson,
      })),
      tenant: {
        name: tenant.name,
        slug: tenant.slug, // Include the slug in the response
        logoUrl: tenant.logoUrl,
        brandPrimaryHex: tenant.brandPrimaryHex,
        brandAccentHex: tenant.brandAccentHex,
      },
      items,
    };
  }
  
  // Toggle widget active/inactive
  async toggleWidget(widgetId: string, isActive: boolean) {
    return this.prisma.widget.update({
      where: { id: widgetId },
      data: { isActive },
    });
  }
}