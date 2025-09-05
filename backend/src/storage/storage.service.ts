import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, CopyObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class StorageService {
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
          }
        : undefined,
    });
  }

   async uploadFile(file: Express.Multer.File, key: string, bucket: string): Promise<string> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Invalid file: No buffer provided');
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      return `https://${bucket}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
    } catch (error) {
      throw new BadRequestException(`S3 upload failed: ${error.message}`);
    }
  }
  // async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
  //   if (!file || !file.buffer) {
  //     throw new BadRequestException('Invalid file: No buffer provided');
  //   }

  //   const params = {
  //     Bucket: 'truetestify',
  //     Key: key,
  //     Body: file.buffer,
  //     ContentType: file.mimetype,
  //   };

  //   try {
  //     await this.s3.send(new PutObjectCommand(params));
  //     return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  //   } catch (error) {
  //     throw new BadRequestException(`S3 upload failed: ${error.message}`);
  //   }
  // }

async copyFile(sourceKey: string, destinationKey: string, sourceBucket: string, destinationBucket: string): Promise<void> {
    const params = {
      Bucket: destinationBucket,
      CopySource: `${sourceBucket}/${sourceKey}`,
      Key: destinationKey,
    };

    try {
      await this.s3.send(new CopyObjectCommand(params));
    } catch (error) {
      throw new BadRequestException(`S3 copy failed: ${error.message}`);
    }
  }
}