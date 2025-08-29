import { Body, Controller, Get, Param, Post, Put, Patch, UseGuards, NotFoundException } from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('widgets')
export class WidgetsController {
  constructor(private svc: WidgetsService) {}

  // 🔒 Create widget (tenant admin)
  @UseGuards(JwtAuthGuard)
  @Post(':tenantId')
  createWidget(@Param('tenantId') tenantId: string, @Body() body: any) {
    return this.svc.createWidget(tenantId, body);
  }

  // 🔒 Update widget
  @UseGuards(JwtAuthGuard)
  @Put(':widgetId')
  updateWidget(@Param('widgetId') widgetId: string, @Body() body: any) {
    return this.svc.updateWidget(widgetId, body);
  }

  // 🔒 List all widgets for a tenant
  @UseGuards(JwtAuthGuard)
  @Get('tenant/:tenantId')
  listWidgets(@Param('tenantId') tenantId: string) {
    return this.svc.listWidgets(tenantId);
  }

  // 🔒 Get a single widget's configuration
  @UseGuards(JwtAuthGuard)
  @Get(':widgetId')
  async getWidgetById(@Param('widgetId') widgetId: string) {
    const widget = await this.svc.getWidgetById(widgetId);
    if (!widget) {
      throw new NotFoundException('Widget not found');
    }
    return widget;
  }

  // 🌍 Public widget feed based on tenant slug (no auth required)
  @Get('feed/:tenantSlug')
  getWidgetFeed(@Param('tenantSlug') tenantSlug: string) {
    return this.svc.getWidgetFeed(tenantSlug);
  }

  // 🔒 Activate/Deactivate widget
  @UseGuards(JwtAuthGuard)
  @Patch(':widgetId/toggle')
  toggleWidget(@Param('widgetId') widgetId: string, @Body('isActive') isActive: boolean) {
    return this.svc.toggleWidget(widgetId, isActive);
  }
}