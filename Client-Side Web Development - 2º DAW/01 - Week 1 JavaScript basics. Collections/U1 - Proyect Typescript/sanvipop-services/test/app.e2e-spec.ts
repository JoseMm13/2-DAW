import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import request from 'supertest';
import express from 'express';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication({ bodyParser: false });
    app.use(express.json({ limit: '8mb' }));
    app.use(express.urlencoded({ limit: '8mb', extended: true }));

    const config = new DocumentBuilder()
      .setTitle('Sanvipop API')
      .setDescription('Sanvipop REST API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document);

    app.use(
      '/reference',
      apiReference({
        spec: {
          content: document,
        },
      }),
    );

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/reference (GET)', () => {
    return request(app.getHttpServer())
      .get('/reference')
      .expect(200);
  });

  it('/api/docs (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/docs')
      .expect((res) => {
        expect([200, 301, 302]).toContain(res.status);
      });
  });

  it('should accept JSON payload larger than default 100kb (e.g. 1MB)', async () => {
    const payload = { email: 'a'.repeat(1024 * 1024), password: 'test' };
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(payload);
    expect(res.status).not.toBe(413);
  });

  it('should reject JSON payload larger than 8MB with 413 Payload Too Large', async () => {
    const payload = { email: 'a'.repeat(9 * 1024 * 1024), password: 'test' };
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(payload);
    expect(res.status).toBe(413);
  });

  afterEach(async () => {
    await app.close();
  });
});
