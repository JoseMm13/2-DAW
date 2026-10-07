import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Cascade, type Rel } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { Product } from './product.entity.js';

@Entity({ tableName: 'product_photo' })
export class ProductPhoto {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Exclude()
  @ManyToOne({ entity: () => Product, fieldName: 'idProduct', cascade: [Cascade.MERGE], index: true })
  product!: Rel<Product>;

  @Property({ type: 'string', length: 250 })
  url!: string;

  constructor(url?: string) {
    if (url) {
      this.url = url;
    }
  }
}

