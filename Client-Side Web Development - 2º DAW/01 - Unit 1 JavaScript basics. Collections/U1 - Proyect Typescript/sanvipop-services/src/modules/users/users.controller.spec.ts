import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { User } from './entities/user.entity.js';

describe('Users Controller', () => {
  let controller: UsersController;
  let usersServiceMock: {
    getUser: ReturnType<typeof vi.fn>;
    getUsersByName: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    usersServiceMock = {
      getUser: vi.fn(),
      getUsersByName: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getCurrentUser should return SingleUserResponseDto with me=true', () => {
    const authUser = {
      id: 1,
      name: 'Arturo',
      email: 'arturo@sanvipop.es',
      lat: 38.4,
      lng: -0.5,
      photo: 'img/users/arturo.jpg',
      registrationDate: new Date(),
    } as User;

    const result = controller.getCurrentUser(authUser);
    expect(result.user).toBeDefined();
    expect(result.user.id).toBe(1);
    expect(result.user.me).toBe(true);
  });

  it('getUser should return SingleUserResponseDto', async () => {
    const authUser = { id: 1 } as User;
    const targetUser = {
      id: 2,
      name: 'María',
      email: 'maria@sanvipop.es',
      lat: 38.39,
      lng: -0.51,
      photo: 'img/users/maria.jpg',
      registrationDate: new Date(),
    } as User;

    usersServiceMock.getUser.mockResolvedValue(targetUser);

    const result = await controller.getUser(authUser, 2);
    expect(result.user.id).toBe(2);
    expect(result.user.me).toBe(false);
  });
});
