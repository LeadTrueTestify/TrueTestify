import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket = process.env.AWS_S3_BUCKET!;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  // ✅ Generate presigned **upload** URL
  // s3.service.ts
  async getUploadUrl({
    key,
    contentType,
    expiresIn = 3600,
  }: {
    key: string;
    contentType?: string; // <-- optional
    expiresIn?: number;
  }) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType || 'application/octet-stream', // fallback
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  // ✅ Generate presigned **download** URL
  async getDownloadUrl({
    key,
    expiresIn = 3600,
  }: {
    key: string;
    expiresIn?: number;
  }) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  // ✅ Upload file directly (buffer method)
  async uploadBuffer(key: string, buffer: Buffer, contentType: string) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return {
      key,
      url: `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  }

  // ✅ List files
  async list(prefix?: string) {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });
    const result = await this.s3.send(command);
    return result.Contents?.map((obj) => obj.Key) ?? [];
  }

  // ✅ Delete file
  async delete(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    return { deleted: true, key };
  }
sanitizeFileName(filename?: string, file?: Express.Multer.File): string {
  // Fallback to file.originalname or "upload.bin"
  let name = filename || file?.originalname || "upload.bin";

  return name
    .trim()
    .replace(/\s+/g, "_")          // replace spaces with underscores
    .replace(/[^a-zA-Z0-9._-]/g, ""); // strip unsafe characters
}

  // ✅ Utility to build structured keys for files
  buildKey(type: string, filename: string) {
  return `${type}/${Date.now()}_${filename}`;
}
}
