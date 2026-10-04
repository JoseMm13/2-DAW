import {
  Entity,
  Index,
  ManyToOne,
  Property,
  OneToOne,
} from '@mikro-orm/decorators/legacy';
import { Cascade, PrimaryKeyProp, type Opt, type Rel } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { Product } from '../../products/entities/product.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity({ tableName: 'transaction' })
export class Transaction {
  [PrimaryKeyProp]?: 'product';

  @ManyToOne({ entity: () => User, fieldName: 'idSeller', cascade: [Cascade.MERGE], index: true })
  @Exclude()
  seller!: Rel<User>;

  @ManyToOne({ entity: () => User, fieldName: 'idBuyer', cascade: [Cascade.MERGE], index: true })
  @Exclude()
  buyer!: Rel<User>;

  @OneToOne({
    entity: () => Product,
    fieldName: 'idProduct',
    primary: true,
    owner: true,
    inversedBy: 'rating',
    index: true,
    joinColumn: 'idProduct',
  })
  @Exclude()
  product!: Rel<Product>;

  @Property({ type: 'number', fieldName: 'sellerRating', nullable: true })
  sellerRating?: number;

  @Property({ type: 'number', fieldName: 'buyerRating', nullable: true })
  buyerRating?: number;

  @Property({ type: 'string', fieldName: 'sellerComment', length: 2000, nullable: true })
  sellerComment?: string;

  @Property({ type: 'string', fieldName: 'buyerComment', length: 2000, nullable: true })
  buyerComment?: string;

  @Index()
  @Property({ type: 'Date', columnType: 'timestamp', fieldName: 'dateTransaction', defaultRaw: `CURRENT_TIMESTAMP` })
  dateTransaction: Opt<Date> = new Date();

  constructor(product?: any) {
    if (product) {
      this.seller = product.owner;
      this.buyer = product.soldTo!;
      this.product = product;
    }
  }
}

