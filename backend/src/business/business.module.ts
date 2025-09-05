import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService, PrismaService,StorageService,ConfigService],
})
export class BusinessModule {}