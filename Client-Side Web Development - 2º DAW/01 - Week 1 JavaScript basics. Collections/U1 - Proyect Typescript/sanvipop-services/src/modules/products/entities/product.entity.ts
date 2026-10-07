import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  Index,
  ManyToOne,
  OneToOne,
  OneToMany,
} from '@mikro-orm/decorators/legacy';
import { Cascade, Collection, type Opt, type Rel } from '@mikro-orm/core';
import { Transform, Exclude } from 'class-transformer';
import { Category } from '../../categories/entities/category.entity.js';
import { ProductPhoto } from './product-photo.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { ProductBookmark } from './product-bookmark.entity.js';
import { Transaction } from '../../transactions/entities/transaction.entity.js';
import { ProductsRepository } from '../products.repository.js';

export enum ProductStatus {
  AVAILABLE = 1,
  RESERVED = 2,
  SOLD = 3,
}

@Entity({ tableName: 'product', repository: () => ProductsRepository })
export class Product {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Index()
  @Property({ type: 'Date', columnType: 'timestamp', fieldName: 'datePublished', defaultRaw: `CURRENT_TIMESTAMP` })
  datePublished: Opt<Date> = new Date();

  @Property({ type: 'string', length: 250 })
  title!: string;

  @Property({ type: 'string', length: 2000 })
  description!: string;

  @Enum({ items: () => ProductStatus, default: ProductStatus.AVAILABLE })
  status: Opt<ProductStatus> = ProductStatus.AVAILABLE;

  @Property({ type: 'number', columnType: 'double' })
  price!: number;

  @ManyToOne({ entity: () => User, fieldName: 'idUser', cascade: [Cascade.MERGE], index: true })
  owner!: Rel<User>;

  @Property({ type: 'number', fieldName: 'numVisits', default: 0 })
  numVisits: Opt<number> = 0;

  @ManyToOne({ entity: () => Category, fieldName: 'idCategory', cascade: [Cascade.MERGE], index: true })
  category!: Rel<Category>;

  @OneToOne({
    entity: () => ProductPhoto,
    fieldName: 'mainPhoto',
    cascade: [Cascade.MERGE],
    nullable: true,
    index: true,
    unique: true,
  })
  @Transform((p: any) => p.value && p.value.url)
  mainPhoto?: Rel<ProductPhoto>;

  @ManyToOne({ entity: () => User, fieldName: 'soldTo', cascade: [Cascade.MERGE], nullable: true, index: true })
  soldTo?: Rel<User>;

  @OneToOne({ entity: () => Transaction, mappedBy: (t: Transaction) => t.product })
  rating?: Rel<Transaction>;

  @OneToMany({ entity: () => ProductPhoto, mappedBy: (photo: ProductPhoto) => photo.product, cascade: [Cascade.PERSIST] })
  @Transform((photos: any) => (photos.value?.isInitialized() ? photos.value.getItems() : null))
  photos = new Collection<ProductPhoto>(this);

  @OneToMany({ entity: () => ProductBookmark, mappedBy: (bm: ProductBookmark) => bm.product })
  @Exclude()
  bookmarks = new Collection<ProductBookmark>(this);

  @Property({ type: 'boolean', persist: false })
  bookmarked?: boolean;

  @Property({ type: 'number', persist: false })
  distance?: number;

  constructor(title?: string, description?: string, price?: number, owner?: any, category?: any) {
    if (title) this.title = title;
    if (description) this.description = description;
    if (price !== undefined) this.price = price;
    if (owner) this.owner = owner;
    if (category) this.category = category;
  }

  addPhoto(photo: ProductPhoto): void {
    this.photos.add(photo);
    photo.product = this;
  }
}

