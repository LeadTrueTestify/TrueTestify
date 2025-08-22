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

  @Get(':slug') 
  getBySlug(@Param('slug') slug: string) {
    return this.svc.getBySlug(slug);
  }

  @Get('slug/:slug') 
  getTenantBySlug(@Param('slug') slug: string) {
    return this.svc.getBySlug(slug);
  }

  @Patch(':id') 
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Post(':id/api-keys')
// @UseGuards(JwtAuthGuard)
createApiKey(@Param('id') tenantId: string, @Req() req) {
  console.log('req.user:', req.user); // Add this line to debug
  if (!req.user || !req.user.id) {
    throw new UnauthorizedException('User is not authenticated or user ID is missing.');
  }
  return this.svc.createApiKey(tenantId, req.user.id);
}
}
