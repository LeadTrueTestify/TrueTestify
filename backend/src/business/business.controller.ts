// src/business/business.controller.ts
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { Request } from 'express'; // Use import type

@Controller('business')
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Get('public/:slug')
  async getPublicProfile(@Param('slug') slug: string) {
    return this.businessService.getPublicProfile(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Req() request: Request) {
    return this.businessService.getMyProfile(request);
  }
}