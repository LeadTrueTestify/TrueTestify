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
        isActive: dto.isActive ?? true,
      },
    });
  }

  // Get all widgets for a tenant
  async listWidgets(tenantId: string) {
    return this.prisma.widget.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get widget feed (public)
  async getWidgetFeed(widgetId: string) {
    const widget = await this.prisma.widget.findUnique({
      where: { id: widgetId },
      include: { tenant: true },
    });

    if (!widget || !widget.isActive) {
      throw new NotFoundException('Widget not found or inactive');
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        tenantId: widget.tenantId,
        status: 'APPROVED',
      },
      orderBy: { createdAt: 'desc' },
      include: { video: true, audio: true },
      take: 50,
    });

    const items = reviews.map((r) => ({
      id: r.id,
      authorName: r.authorName,
      text: r.textStatus === 'APPROVED' ? r.text : null,
      videoUrl: r.video?.url,
      audioUrl: r.audio?.url,
      previewUrl: r.previewUrl,
      durationSec: r.durationSec,
    }));

    return {
      widget: {
        id: widget.id,
        name: widget.name,
        layout: widget.layout,
        themeJson: widget.themeJson,
      },
      tenant: {
        name: widget.tenant.name,
        logoUrl: widget.tenant.logoUrl,
        brandPrimaryHex: widget.tenant.brandPrimaryHex,
        brandAccentHex: widget.tenant.brandAccentHex,
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
