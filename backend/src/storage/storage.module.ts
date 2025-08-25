import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { StorageController } from './storage.controller'
import { S3Service } from './s3.service'
@Module({ providers: [S3Service], exports: [S3Service], controllers: [StorageController] })
export class StorageModule {}