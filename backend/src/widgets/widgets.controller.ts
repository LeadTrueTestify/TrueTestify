import { Body, Controller, Get, Param, Post, Put, Patch, UseGuards } from '@nestjs/common';
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

  // 🔒 List all widgets for tenant
  @UseGuards(JwtAuthGuard)
  @Get('tenant/:tenantId')
  listWidgets(@Param('tenantId') tenantId: string) {
    return this.svc.listWidgets(tenantId);
  }

  // 🌍 Public widget feed (no auth required)
  @Get('feed/:widgetId')
  getWidgetFeed(@Param('widgetId') widgetId: string) {
    return this.svc.getWidgetFeed(widgetId);
  }

  // 🔒 Activate/Deactivate widget
  @UseGuards(JwtAuthGuard)
  @Patch(':widgetId/toggle')
  toggleWidget(@Param('widgetId') widgetId: string, @Body('isActive') isActive: boolean) {
    return this.svc.toggleWidget(widgetId, isActive);
  }
}
