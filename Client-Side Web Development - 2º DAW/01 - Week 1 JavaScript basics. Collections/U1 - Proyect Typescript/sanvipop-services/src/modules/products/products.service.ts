import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  type FilterQuery,
  QueryOrder,
  type QueryOrderMap,
} from '@mikro-orm/core';
import { Product, ProductStatus } from './entities/product.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { ProductPhoto } from './entities/product-photo.entity.js';
import { User } from '../users/entities/user.entity.js';
import { ProductBookmark } from './entities/product-bookmark.entity.js';
import { Transaction } from '../transactions/entities/transaction.entity.js';
import { ProductsRepository } from './products.repository.js';
import { InsertProductDto } from './dto/insert-product.dto.js';
import { EditProductDto } from './dto/edit-product.dto.js';
import { AddPhotoDto } from './dto/add-photo.dto.js';
import {
  ProductsQueryDto,
  ProductSort,
} from './dto/products-query.dto.js';
import {
  UserProductsQueryDto,
  ProductUserStatus,
} from './dto/user-products-query.dto.js';
import { PaginatedProductsDto } from './dto/product-response.dto.js';
import { ImageService } from '../../common/services/image/image.service.js';
import { FirebaseService } from '../../common/services/firebase/firebase.service.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductsRepository,
    @InjectRepository(ProductPhoto)
    private readonly prodPhotoRepository: EntityRepository<ProductPhoto>,
    @InjectRepository(ProductBookmark)
    private readonly prodBookmarkRepository: EntityRepository<ProductBookmark>,
    @InjectRepository(Category)
    private readonly catRepository: EntityRepository<Category>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Transaction)
    private readonly transRepository: EntityRepository<Transaction>,
    private readonly imageService: ImageService,
    private readonly firebaseService: FirebaseService,
  ) {}

  private async getAndCheckProduct(
    authUser: User,
    id: number,
    relations: (keyof Product)[] = [],
  ): Promise<Product> {
    const product = await this.productRepository.findOne(
      { id },
      { populate: relations as any },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.owner.id !== authUser.id) {
      throw new ForbiddenException("You can't modify a product that is not yours");
    }
    return product;
  }

  private getOrderMap(sort?: ProductSort): QueryOrderMap<Product> {
    switch (sort) {
      case ProductSort.PRICE:
        return { price: QueryOrder.ASC };
      case ProductSort.VIEWS:
        return { numVisits: QueryOrder.ASC };
      case ProductSort.DISTANCE:
      default:
        return { distance: QueryOrder.ASC };
    }
  }

  async findAll(
    authUser: User,
    query: ProductsQueryDto = {},
  ): Promise<PaginatedProductsDto> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = 12;
    const offset = (page - 1) * limit;
    const orderBy = this.getOrderMap(query.sort);

    const filter: FilterQuery<Product> = {
      $not: { status: ProductStatus.SOLD },
    };

    if (query.search?.trim()) {
      filter.$or = [
        { title: { $like: `%${query.search.trim()}%` } },
        { description: { $like: `%${query.search.trim()}%` } },
      ];
    }

    const [products, total_products] = await Promise.all([
      this.productRepository.findByDistance(
        authUser.lat,
        authUser.lng,
        authUser.id,
        filter,
        orderBy,
        null,
        limit,
        offset,
      ),
      this.productRepository.count(filter),
    ]);

    const populated = await this.productRepository.populate(products, [
      'owner',
      'mainPhoto',
      'category',
    ]);

    return PaginatedProductsDto.create(
      populated,
      page,
      limit,
      total_products,
    );
  }

  async findAllByDistance(
    authUser: User,
    limit?: number,
    offset?: number,
  ): Promise<Product[]> {
    const products = await this.productRepository.findByDistance(
      authUser.lat,
      authUser.lng,
      authUser.id,
      { $not: { status: ProductStatus.SOLD } },
      undefined,
      null,
      limit,
      offset,
    );
    return this.productRepository.populate(products, [
      'owner',
      'mainPhoto',
      'category',
    ]);
  }

  async findBookmarked(
    authUser: User,
    query: ProductsQueryDto = {},
    idUser: number = authUser.id,
  ): Promise<PaginatedProductsDto> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = 12;
    const offset = (page - 1) * limit;
    const orderBy = this.getOrderMap(query.sort);

    const joinBookmark = new Map<string, any>();
    joinBookmark.set('bookmarks', { 'bookmarks.user': idUser });

    let where: FilterQuery<Product> | null = null;
    if (query.search?.trim()) {
      where = {
        $or: [
          { title: { $like: `%${query.search.trim()}%` } },
          { description: { $like: `%${query.search.trim()}%` } },
        ],
      };
    }

    const countFilter: FilterQuery<Product> = {
      bookmarks: { user: idUser } as any,
      ...(where ? where : {}),
    };

    const [products, total_products] = await Promise.all([
      this.productRepository.findByDistance(
        authUser.lat,
        authUser.lng,
        authUser.id,
        where,
        orderBy,
        joinBookmark,
        limit,
        offset,
      ),
      this.productRepository.count(countFilter),
    ]);

    const populated = await this.productRepository.populate(products, [
      'owner',
      'mainPhoto',
      'category',
    ]);

    return PaginatedProductsDto.create(
      populated,
      page,
      limit,
      total_products,
    );
  }

  async findByUser(
    authUser: User,
    query: UserProductsQueryDto = {},
  ): Promise<PaginatedProductsDto> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = 12;
    const offset = (page - 1) * limit;
    const orderBy = this.getOrderMap(query.sort);

    const targetUserId = query.user ?? authUser.id;
    const status = query.status ?? ProductUserStatus.SELLING;

    let filter: FilterQuery<Product>;
    switch (status) {
      case ProductUserStatus.SOLD:
        filter = { owner: { id: targetUserId }, status: ProductStatus.SOLD };
        break;
      case ProductUserStatus.BOUGHT:
        filter = { soldTo: { id: targetUserId }, status: ProductStatus.SOLD };
        break;
      case ProductUserStatus.SELLING:
      default:
        filter = {
          owner: { id: targetUserId },
          $not: { status: ProductStatus.SOLD },
        };
        break;
    }

    if (query.search?.trim()) {
      filter.$or = [
        { title: { $like: `%${query.search.trim()}%` } },
        { description: { $like: `%${query.search.trim()}%` } },
      ];
    }

    const [products, total_products] = await Promise.all([
      this.productRepository.findByDistance(
        authUser.lat,
        authUser.lng,
        authUser.id,
        filter,
        orderBy,
        null,
        limit,
        offset,
      ),
      this.productRepository.count(filter),
    ]);

    const populated = await this.productRepository.populate(products, [
      'owner',
      'mainPhoto',
      'category',
    ]);

    return PaginatedProductsDto.create(
      populated,
      page,
      limit,
      total_products,
    );
  }

  async findByOwner(authUser: User, idUser: number): Promise<Product[]> {
    const res = await this.findByUser(authUser, {
      user: idUser,
      status: ProductUserStatus.SELLING,
    });
    return res.products;
  }

  async findSold(authUser: User, idUser: number): Promise<Product[]> {
    const res = await this.findByUser(authUser, {
      user: idUser,
      status: ProductUserStatus.SOLD,
    });
    return res.products;
  }

  async findBought(authUser: User, idUser: number): Promise<Product[]> {
    const res = await this.findByUser(authUser, {
      user: idUser,
      status: ProductUserStatus.BOUGHT,
    });
    return res.products;
  }

  async findById(authUser: User, id: number): Promise<Product> {
    const product = await this.productRepository.findById(
      id,
      authUser.id,
      authUser.lat,
      authUser.lng,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.numVisits++;
    await this.productRepository.getEntityManager().flush();
    product.rating = (await this.transRepository.findOne({ product })) || undefined;
    return (await this.productRepository.populate(product, [
      'owner',
      'soldTo',
      'mainPhoto',
      'category',
      'photos',
    ])) as unknown as Product;
  }

  async insert(authUser: User, prodDto: InsertProductDto): Promise<Product> {
    const photoUrl = await this.imageService.saveImage(
      'products',
      prodDto.mainPhoto,
    );
    const category = this.catRepository.getReference(prodDto.category);
    const user = this.userRepository.getReference(authUser.id);
    const mainPhoto = new ProductPhoto(photoUrl);
    const product = new Product(
      prodDto.title,
      prodDto.description,
      prodDto.price,
      user,
      category,
    );
    product.photos.add(mainPhoto);
    this.productRepository.getEntityManager().persist(product);
    await this.productRepository.getEntityManager().flush();
    product.mainPhoto = mainPhoto;
    await this.productRepository.getEntityManager().flush();
    await this.productRepository.populate(product, ['mainPhoto']);
    return product;
  }

  async update(
    authUser: User,
    id: number,
    prodDto: EditProductDto,
  ): Promise<Product> {
    const product = await this.getAndCheckProduct(authUser, id, [
      'owner',
      'mainPhoto',
      'category',
    ]);
    if (prodDto.title) product.title = prodDto.title;
    if (prodDto.description) product.description = prodDto.description;
    if (prodDto.price) product.price = prodDto.price;
    if (prodDto.status) {
      product.status = prodDto.status;
      if (product.status === ProductStatus.SOLD && prodDto.soldTo) {
        product.soldTo = (await this.userRepository.findOne(prodDto.soldTo)) || undefined;
      }
    }
    if (prodDto.category) {
      const category = await this.catRepository.findOne(prodDto.category);
      if (!category) {
        throw new BadRequestException('Category not found');
      }
      product.category = category;
    }
    if (prodDto.mainPhoto) {
      const mainPhoto = await this.prodPhotoRepository.findOne(
        prodDto.mainPhoto,
      );
      if (!mainPhoto || mainPhoto.product.id !== id) {
        throw new BadRequestException("It must be a product's photo");
      }
      product.mainPhoto = mainPhoto;
    }
    await this.productRepository.getEntityManager().flush();
    return product;
  }

  async buyProduct(authUser: User, id: number): Promise<void> {
    const product = await this.productRepository.findOne(
      { id },
      { populate: ['owner', 'mainPhoto', 'category'] },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.owner.id === authUser.id) {
      throw new BadRequestException('You cannot buy your own product');
    }
    if (product.status === ProductStatus.SOLD) {
      throw new ConflictException('This product has already been sold');
    }

    await this.productRepository.getEntityManager().transactional(async (em) => {
      product.status = ProductStatus.SOLD;
      product.soldTo = authUser;
      const transaction = new Transaction(product);
      em.persist(transaction);
      em.persist(product);
    });

    if (product.owner.firebaseToken) {
      await this.firebaseService.sendMessage(
        product.owner.firebaseToken,
        'You have sold a product!',
        `${authUser.name} has bought ${product.title}`,
        { prodId: '' + product.id },
      );
    }
  }

  async delete(authUser: User, id: number): Promise<void> {
    const product = await this.getAndCheckProduct(authUser, id, ['photos']);
    const photoUrls = product.photos.getItems().map((photo) => photo.url);
    this.productRepository.getEntityManager().remove(product);
    await this.productRepository.getEntityManager().flush();
    for (const url of photoUrls) {
      await this.imageService.removeImage(url);
    }
  }

  async addBookmark(authUser: User, idProd: number): Promise<void> {
    const product = await this.productRepository.findOne(idProd);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const bookmark = await this.prodBookmarkRepository.findOne({
      user: authUser.id,
      product: idProd,
    });
    if (!bookmark) {
      const newBookmark = new ProductBookmark(product, authUser);
      this.prodBookmarkRepository.getEntityManager().persist(newBookmark);
      await this.prodBookmarkRepository.getEntityManager().flush();
    }
  }

  async removeBookmark(authUser: User, idProd: number): Promise<void> {
    await this.prodBookmarkRepository.nativeDelete({
      user: authUser.id,
      product: idProd,
    });
  }

  async addPhoto(
    authUser: User,
    idProd: number,
    photoDto: AddPhotoDto,
  ): Promise<ProductPhoto> {
    const product = await this.getAndCheckProduct(authUser, idProd);
    const photoUrl = await this.imageService.saveImage(
      'products',
      photoDto.photo,
    );
    const photo = new ProductPhoto(photoUrl);
    photo.product = product;
    await this.prodPhotoRepository.getEntityManager().persist(photo);
    if (photoDto.setMain) {
      product.mainPhoto = photo;
    }
    await this.productRepository.getEntityManager().flush();
    return photo;
  }

  async removePhoto(
    authUser: User,
    idProd: number,
    idPhoto: number,
  ): Promise<void> {
    const product = await this.getAndCheckProduct(authUser, idProd, ['photos']);
    const photo = product.photos
      .getItems()
      .find((photo) => photo.id === idPhoto);
    if (!photo) {
      throw new NotFoundException('Photo not found in this product');
    }
    const photoUrl = photo.url;
    this.prodPhotoRepository.getEntityManager().remove(photo);
    await this.prodPhotoRepository.getEntityManager().flush();
    await this.imageService.removeImage(photoUrl);
  }
}
