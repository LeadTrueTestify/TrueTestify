import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './business/business.module';
import { PrismaService } from '../prisma/prisma.service';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [AuthModule, BusinessModule, StorageModule],
  providers: [PrismaService],
})
export class AppModule {}