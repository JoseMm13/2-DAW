import { Entity, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Cascade, type Rel } from '@mikro-orm/core';
import { Product } from './product.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity({ tableName: 'product_bookmark' })
export class ProductBookmark {
  @ManyToOne({ entity: () => Product, fieldName: 'idProduct', cascade: [Cascade.ALL], primary: true })
  product!: Rel<Product>;

  @ManyToOne({ entity: () => User, fieldName: 'idUser', cascade: [Cascade.ALL], primary: true, index: 'idUser' })
  user!: Rel<User>;

  constructor(product?: any, user?: any) {
    if (product) this.product = product;
    if (user) this.user = user;
  }
}

