
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private s3: S3Client;

  constructor() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    const s3Config: any = {
      region: process.env.AWS_REGION || 'us-east-1',
    };

    if (accessKeyId && secretAccessKey) {
      s3Config.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    this.s3 = new S3Client(s3Config);
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    try {
      const bucket = process.env.AWS_S3_BUCKET;
      if (!bucket) {
        throw new Error('AWS_S3_BUCKET environment variable is not set');
      }

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key, // e.g., logos/{slug}/{filename}
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL is deprecated; use bucket policy for public access
      });

      await this.s3.send(command);
      const location = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      return location;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new InternalServerErrorException(`Failed to upload to S3: ${error.message}`);
    }
  }
}