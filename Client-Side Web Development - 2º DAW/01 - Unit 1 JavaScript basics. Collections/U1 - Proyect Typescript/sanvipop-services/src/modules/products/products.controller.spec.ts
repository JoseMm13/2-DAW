import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

import { vi, describe, beforeEach, it, expect } from 'vitest';
import { User } from '../users/entities/user.entity.js';
import { ProductsQueryDto, ProductSort } from './dto/products-query.dto.js';
import { UserProductsQueryDto, ProductUserStatus } from './dto/user-products-query.dto.js';

describe('Products Controller', () => {
  let controller: ProductsController;
  let productsServiceMock: {
    findAll: ReturnType<typeof vi.fn>;
    findByUser: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    productsServiceMock = {
      findAll: vi.fn().mockResolvedValue({
        products: [],
        page: 2,
        total_pages: 1,
        total_products: 5,
      }),
      findByUser: vi.fn().mockResolvedValue({
        products: [],
        page: 1,
        total_pages: 1,
        total_products: 3,
      }),
      findBookmarked: vi.fn().mockResolvedValue({
        products: [],
        page: 1,
        total_pages: 1,
        total_products: 2,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: productsServiceMock,
        },
        {
          provide: ConfigService,
          useValue: { get: () => '' },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllProducts should call productsService.findAll with authUser and query and return paginated DTO', async () => {
    const authUser = { id: 1 } as User;
    const query: ProductsQueryDto = {
      page: 2,
      sort: ProductSort.PRICE,
      search: 'bici',
    };

    const result = await controller.getAllProducts(authUser, query);

    expect(productsServiceMock.findAll).toHaveBeenCalledWith(authUser, query);
    expect(result).toEqual({
      products: [],
      page: 2,
      total_pages: 1,
      total_products: 5,
    });
  });

  it('getUserProducts should call productsService.findByUser with authUser and query and return paginated DTO', async () => {
    const authUser = { id: 1 } as User;
    const query: UserProductsQueryDto = {
      page: 1,
      user: 5,
      status: ProductUserStatus.SOLD,
      sort: ProductSort.VIEWS,
      search: 'moto',
    };

    const result = await controller.getUserProducts(authUser, query);

    expect(productsServiceMock.findByUser).toHaveBeenCalledWith(authUser, query);
    expect(result).toEqual({
      products: [],
      page: 1,
      total_pages: 1,
      total_products: 3,
    });
  });

  it('getBookmarkedProducts should call productsService.findBookmarked with authUser and query and return paginated DTO', async () => {
    const authUser = { id: 1 } as User;
    const query: ProductsQueryDto = {
      page: 1,
      sort: ProductSort.DISTANCE,
      search: 'bici',
    };

    const result = await controller.getBookmarkedProducts(authUser, query);

    expect(productsServiceMock.findBookmarked).toHaveBeenCalledWith(authUser, query);
    expect(result).toEqual({
      products: [],
      page: 1,
      total_pages: 1,
      total_products: 2,
    });
  });
});
