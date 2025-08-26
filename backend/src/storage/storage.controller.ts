import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { SignUploadDto } from './dto/sign-upload.dto';
import { SignDownloadDto } from './dto/sign-download.dto';
import { ServerUploadDto } from './dto/server-upload.dto';
import { DeleteFileDto } from './dto/delete-file.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly s3: S3Service) {}

  // 1) Presigned PUT for browser to upload directly
  @Post('sign-upload')
  async signUpload(@Body() dto: SignUploadDto) {
    // build the key using type + filename
    const safeFileName = this.s3.sanitizeFileName(dto.filename);

    const key = this.s3.buildKey(dto.type, safeFileName);
    const url = await this.s3.getUploadUrl({
      key,
      contentType: dto.contentType,
      expiresIn: dto.expiresIn,
    });

    return { url, key };
  }

  // 2) Presigned GET for private download/preview
  @Post('sign-download')
  signDownload(@Body() dto: SignDownloadDto) {
    return this.s3.getDownloadUrl({ key: dto.key, expiresIn: dto.expiresIn });
  }

  // 3) Direct server upload (multipart) — not needed if you use presigned
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ServerUploadDto,
  ) {
    if (!file) {
      throw new Error('File is required');
    }
    const safeFileName = this.s3.sanitizeFileName(dto.filename, file);
    const key = this.s3.buildKey(dto.type, safeFileName);

    const url = await this.s3.uploadBuffer(
      key,
      file.buffer,
      dto.contentType || file.mimetype,
    );

    return { key, url };
  }

  // 4) List files (optionally by prefix)
  @Get('list')
  list(@Query('prefix') prefix?: string) {
    return this.s3.list(prefix);
  }

  // 5) Delete a file
  @Delete('file')
  remove(@Body() dto: DeleteFileDto) {
    return this.s3.delete(dto.key);
  }
}
