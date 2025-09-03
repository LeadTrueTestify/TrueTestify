import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller()
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Get('business/:slug')
  async getPublicProfile(@Param('slug') slug: string) {
    return this.businessService.getPublicProfile(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/business/me')
  async getMyProfile(@Req() request: Request) {
    return this.businessService.getMyProfile(request);
  }
}