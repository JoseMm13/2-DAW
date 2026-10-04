import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { Product } from '../../products/entities/product.entity.js';

@Entity({ tableName: 'category' })
export class Category {
  @PrimaryKey({ type: 'number', columnType: 'tinyint' })
  id!: number;

  @Property({ type: 'string', length: 200 })
  name!: string;

  @OneToMany(() => Product, (product: Product) => product.category)
  @Exclude()
  products = new Collection<Product>(this);
}

