import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/v1/tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private svc: TenantsService) {}

  @Get(':id')
  getBySlug(@Param('id') id: string) {
    return this.svc.getBySlug(id);
  }

  @Get('slug/:slug')
  getTenantBySlug(@Param('slug') slug: string) {
    return this.svc.getBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }

@Post(':id/api-keys') // Add this line to protect the route
  async createApiKey(@Param('id') tenantId: string, @Req() req) {
    // The `req.user` object is now guaranteed to exist and contain `userId`
    // because of the `@UseGuards` decorator.
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User is not authenticated or user ID is missing.');
    }
    
    // Pass the correct user ID to the service.
    return this.svc.createApiKey(tenantId, req.user.userId);
  }
}
