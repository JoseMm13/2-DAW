import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { vi, describe, beforeAll, it, expect } from 'vitest';
import { AuthService } from './auth.service.js';
import { User } from '../users/entities/user.entity.js';
import { ImageService } from '../../common/services/image/image.service.js';
import { UsersService } from '../users/users.service.js';
import { GOOGLE_ID } from './interfaces/providers.js';

describe('AuthService', () => {
  let service: AuthService;
  let userRepoMock: {
    findOne: ReturnType<typeof vi.fn>;
    getEntityManager: ReturnType<typeof vi.fn>;
  };
  let jwtServiceMock: { sign: ReturnType<typeof vi.fn> };

  beforeAll(async () => {
    userRepoMock = {
      findOne: vi.fn(),
      getEntityManager: vi.fn().mockReturnValue({ flush: vi.fn() }),
    };
    jwtServiceMock = {
      sign: vi.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: GOOGLE_ID,
          useValue: 'google-test-id',
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepoMock,
        },
        {
          provide: ImageService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      userRepoMock.findOne.mockResolvedValue(null);
      await expect(
        service.login({ email: 'nonexistent@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correct-password', 10);
      userRepoMock.findOne.mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        password: hashedPassword,
      });

      await expect(
        service.login({ email: 'user@example.com', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access token if credentials are valid', async () => {
      const plainPass = 'secret123';
      const hashedPassword = await bcrypt.hash(plainPass, 10);
      userRepoMock.findOne.mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        password: hashedPassword,
      });

      const result = await service.login({ email: 'user@example.com', password: plainPass });
      expect(result).toEqual({ accessToken: 'mock-jwt-token' });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
