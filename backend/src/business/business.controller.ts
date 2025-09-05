import { Controller, Get, Put, Request, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Param, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('')
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Get('api/business/me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Request() req) {
    return this.businessService.getMyProfile(req);
  }

  @Get('business/:slug')
  async getPublicProfile(@Param('slug') slug: string) {
    return this.businessService.getPublicProfile(slug);
  }

  @Put('api/business/me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  async updateMyProfile(@Request() req, @UploadedFile() logo: Express.Multer.File, @Body() body: { name: string; website?: string; brandColor?: string }) {
    if (!body.name) throw new BadRequestException('Business name is required');
    return this.businessService.updateMyProfile(req, { ...body, logo });
  }
}