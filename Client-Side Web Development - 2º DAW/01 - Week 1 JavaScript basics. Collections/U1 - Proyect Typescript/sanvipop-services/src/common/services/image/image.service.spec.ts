import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service.js';
import * as fs from 'fs/promises';
import { vi, describe, beforeEach, it, expect } from 'vitest';

vi.mock('fs/promises', () => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
  unlink: vi.fn().mockResolvedValue(undefined),
}));

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageService],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveImage', () => {
    it('should save PNG image with .png extension when header is present', async () => {
      const result = await service.saveImage(
        'products',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      );
      expect(result).toMatch(/^img\/products\/\d+-[0-9a-f-]+\.png$/);
      expect(fs.mkdir).toHaveBeenCalledWith('img/products', { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringMatching(/^img\/products\/\d+-[0-9a-f-]+\.png$/),
        expect.any(Buffer),
      );
    });

    it('should save JPEG image with .jpg extension when header is image/jpeg', async () => {
      const result = await service.saveImage(
        'users',
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/',
      );
      expect(result).toMatch(/^img\/users\/\d+-[0-9a-f-]+\.jpg$/);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringMatching(/^img\/users\/\d+-[0-9a-f-]+\.jpg$/),
        expect.any(Buffer),
      );
    });

    it('should save WebP image with .webp extension when header is image/webp', async () => {
      const result = await service.saveImage(
        'products',
        'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAQAcJaACdLoAAP7/2wAA',
      );
      expect(result).toMatch(/^img\/products\/\d+-[0-9a-f-]+\.webp$/);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringMatching(/^img\/products\/\d+-[0-9a-f-]+\.webp$/),
        expect.any(Buffer),
      );
    });

    it('should save GIF image with .gif extension when header is image/gif', async () => {
      const result = await service.saveImage(
        'products',
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      );
      expect(result).toMatch(/^img\/products\/\d+-[0-9a-f-]+\.gif$/);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringMatching(/^img\/products\/\d+-[0-9a-f-]+\.gif$/),
        expect.any(Buffer),
      );
    });

    it('should save SVG image with .svg extension when header is image/svg+xml', async () => {
      const result = await service.saveImage(
        'products',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==',
      );
      expect(result).toMatch(/^img\/products\/\d+-[0-9a-f-]+\.svg$/);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringMatching(/^img\/products\/\d+-[0-9a-f-]+\.svg$/),
        expect.any(Buffer),
      );
    });

    it('should save as .jpg if photo has no header', async () => {
      const result = await service.saveImage(
        'users',
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      );
      expect(result).toMatch(/^img\/users\/\d+-[0-9a-f-]+\.jpg$/);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringMatching(/^img\/users\/\d+-[0-9a-f-]+\.jpg$/),
        expect.any(Buffer),
      );
    });

    it('should fallback to .jpg if header does not specify an image type', async () => {
      const result = await service.saveImage('users', 'invalid-header,iVBORw0KGgoAAAANSUhEUgAA');
      expect(result).toMatch(/^img\/users\/\d+-[0-9a-f-]+\.jpg$/);
    });
  });
});
