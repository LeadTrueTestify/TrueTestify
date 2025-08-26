import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'

@Injectable()
export class StorageService {
   private readonly s3: S3;
  private readonly bucket: string;
  private readonly region: string;
 constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.bucket = process.env.AWS_S3_BUCKET || 'your-bucket-name';

    this.s3 = new S3({
      region: this.region,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
  createUploadUrl(tenantSlug: string, opts: { contentType: string }) {
    const key = `${tenantSlug}/videos/${uuid()}.webm` // client compresses to 720p webm/mp4
    const url = this.s3.getSignedUrl('putObject', {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Expires: 60 * 5,
      ContentType: opts.contentType,
      ACL: 'public-read',
    })
    return { key, url }
  }

  getPublicUrl(key: string) {
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  }
  async uploadFile(key: string, fileBuffer: Buffer, contentType: string) {
  await this.s3
    .putObject({
      Bucket: this.bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
    .promise();

  return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
}

}