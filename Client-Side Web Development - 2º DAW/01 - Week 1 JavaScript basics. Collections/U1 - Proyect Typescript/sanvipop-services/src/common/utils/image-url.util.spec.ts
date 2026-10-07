import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildFullImageUrl } from './image-url.util.js';
import type { Request } from 'express';

describe('buildFullImageUrl', () => {
  const originalEnv = process.env.BASE_PATH;

  beforeEach(() => {
    delete process.env.BASE_PATH;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.BASE_PATH = originalEnv;
    } else {
      delete process.env.BASE_PATH;
    }
  });

  it('should return empty string if partialUrl is undefined or empty', () => {
    expect(buildFullImageUrl(undefined, undefined)).toBe('');
    expect(buildFullImageUrl(undefined, null)).toBe('');
    expect(buildFullImageUrl(undefined, '')).toBe('');
  });

  it('should return full URL as is if it starts with http:// or https://', () => {
    const httpUrl = 'http://example.com/photo.jpg';
    const httpsUrl = 'https://example.com/avatar.jpg';

    expect(buildFullImageUrl(undefined, httpUrl)).toBe(httpUrl);
    expect(buildFullImageUrl(undefined, httpsUrl)).toBe(httpsUrl);
  });

  it('should prepend protocol and host from request when partial URL is provided', () => {
    const req = {
      protocol: 'https',
      headers: { host: 'api.sanvipop.es' },
      get: (header: string) => (header === 'host' ? 'api.sanvipop.es' : undefined),
    } as unknown as Request;

    const result = buildFullImageUrl(req, 'img/products/foto.jpg');
    expect(result).toBe('https://api.sanvipop.es/img/products/foto.jpg');
  });

  it('should handle leading slash correctly', () => {
    const req = {
      protocol: 'http',
      headers: { host: 'localhost:3000' },
      get: (header: string) => (header === 'host' ? 'localhost:3000' : undefined),
    } as unknown as Request;

    const result = buildFullImageUrl(req, '/img/users/avatar.jpg');
    expect(result).toBe('http://localhost:3000/img/users/avatar.jpg');
  });

  it('should include BASE_PATH if present in process.env', () => {
    process.env.BASE_PATH = 'api/v1';

    const req = {
      protocol: 'https',
      headers: { host: 'sanvipop.com' },
      get: () => 'sanvipop.com',
    } as unknown as Request;

    const result = buildFullImageUrl(req, 'img/products/item.jpg');
    expect(result).toBe('https://sanvipop.com/api/v1/img/products/item.jpg');
  });
});

