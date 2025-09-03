import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './business/business.module';
import { PrismaService } from '../prisma/prisma.service';
import { StorageModule } from './storage/storage.module';
import { AppController } from './app.controller';
import { ReviewModule } from './review/review.module';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, BusinessModule, StorageModule,ReviewModule],
  controllers: [AppController],
  providers: [PrismaService,AppService],
})
export class AppModule {}