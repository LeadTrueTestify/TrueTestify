import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ReviewModule } from './review.module';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { BullModule } from '@nestjs/bull';
import * as fs from 'fs';

describe('ReviewController', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ReviewModule,
        BullModule.forRoot({
          redis: { host: 'localhost', port: 6379 },
        }),
      ],
      providers: [PrismaService, StorageService],
    }).compile();

    app = module.createNestApplication();
    prisma = module.get<PrismaService>(PrismaService);
    await app.init();

    await prisma.business.create({
      data: {
        id: 'test-business-id',
        slug: 'testbusiness',
        name: 'Test Business',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/public/:slug/reviews', () => {
    it('should create a video review', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/public/testbusiness/reviews')
        .send({
          type: 'video',
          title: 'Great Video Review',
          bodyText: 'Amazing video!',
          rating: 5,
          reviewerName: 'John Doe',
          consentChecked: true,
        })
        .expect(201);

      expect(response.body).toMatchObject({
        reviewId: expect.any(String),
        status: 'pending',
        message: 'Review created, ready for chunk uploads',
      });

      const review = await prisma.review.findFirst({ where: { id: response.body.reviewId } });
      expect(review).toMatchObject({
        businessId: 'test-business-id',
        type: 'video',
        status: 'pending',
        consentChecked: true,
      });
    });

    it('should create a text review', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/public/testbusiness/reviews')
        .send({
          type: 'text',
          title: 'Great Text Review',
          bodyText: 'Amazing text review!',
          rating: 5,
          reviewerName: 'John Doe',
          consentChecked: true,
        })
        .expect(201);

      expect(response.body).toMatchObject({
        reviewId: expect.any(String),
        status: 'pending',
        message: 'Text review submitted',
      });

      const mediaAsset = await prisma.mediaAsset.findFirst({ where: { reviewId: response.body.reviewId } });
      expect(mediaAsset).toMatchObject({
        assetType: 'text/plain',
        sizeBytes: expect.any(Number),
        durationSec: null,
        metadataJson: null,
      });
    });

    it('should fail without consent', async () => {
      await request(app.getHttpServer())
        .post('/api/public/testbusiness/reviews')
        .send({ type: 'video', consentChecked: false })
        .expect(400, { message: 'Consent is required' });
    });

    it('should fail with invalid type', async () => {
      await request(app.getHttpServer())
        .post('/api/public/testbusiness/reviews')
        .send({ type: 'image', consentChecked: true })
        .expect(400, { message: 'Type must be video, audio, or text' });
    });
  });

  describe('POST /api/public/:slug/reviews/:reviewId/chunk', () => {
    let reviewId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/public/testbusiness/reviews')
        .send({
          type: 'video',
          consentChecked: true,
        });
      reviewId = response.body.reviewId;
    });

    it('should upload a chunk', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/public/testbusiness/reviews/${reviewId}/chunk`)
        .field('chunkIndex', '0')
        .attach('chunk', fs.readFileSync('/path/to/chunk1.bin'), 'chunk1.bin')
        .expect(200);

      expect(response.body).toMatchObject({
        chunkIndex: 0,
        status: 'uploaded',
      });
    });

    it('should fail for text review', async () => {
      const textReview = await request(app.getHttpServer())
        .post('/api/public/testbusiness/reviews')
        .send({
          type: 'text',
          bodyText: 'Test text',
          consentChecked: true,
        });
      await request(app.getHttpServer())
        .post(`/api/public/testbusiness/reviews/${textReview.body.reviewId}/chunk`)
        .field('chunkIndex', '0')
        .attach('chunk', fs.readFileSync('/path/to/chunk1.bin'), 'chunk1.bin')
        .expect(400, { message: 'Chunk uploads are not supported for text reviews' });
    });
  });

  describe('POST /api/public/:slug/reviews/:reviewId/finalize', () => {
    let reviewId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/public/testbusiness/reviews')
        .send({
          type: 'video',
          consentChecked: true,
        });
      reviewId = response.body.reviewId;
      await request(app.getHttpServer())
        .post(`/api/public/testbusiness/reviews/${reviewId}/chunk`)
        .field('chunkIndex', '0')
        .attach('chunk', fs.readFileSync('/path/to/chunk1.bin'), 'chunk1.bin');
    });

    it('should finalize upload', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/public/testbusiness/reviews/${reviewId}/finalize`)
        .send({ type: 'video' })
        .expect(200);

      expect(response.body).toMatchObject({
        reviewId,
        status: 'finalized',
        message: 'Upload finalized, transcoding queued',
      });

      const mediaAsset = await prisma.mediaAsset.findFirst({ where: { reviewId } });
      expect(mediaAsset).toMatchObject({
        assetType: 'video/mp4',
        sizeBytes: expect.any(Number),
        durationSec: null,
        metadataJson: null,
      });
    });

    it('should fail with invalid type', async () => {
      await request(app.getHttpServer())
        .post(`/api/public/testbusiness/reviews/${reviewId}/finalize`)
        .send({ type: 'audio' })
        .expect(400, { message: 'Type does not match review type' });
    });
  });
})