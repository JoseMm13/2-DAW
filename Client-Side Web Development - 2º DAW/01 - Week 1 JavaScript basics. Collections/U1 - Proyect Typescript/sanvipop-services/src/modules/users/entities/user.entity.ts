import { Entity, PrimaryKey, Property, Unique, ManyToMany } from '@mikro-orm/decorators/legacy';
import { Collection, type Opt } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { Product } from '../../products/entities/product.entity.js';
import { ProductBookmark } from '../../products/entities/product-bookmark.entity.js';

@Entity({ tableName: 'user' })
export class User {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'Date', columnType: 'timestamp', fieldName: 'registrationDate', defaultRaw: `CURRENT_TIMESTAMP` })
  registrationDate: Opt<Date> = new Date();

  @Property({ type: 'string', length: 250 })
  name!: string;

  @Unique({ name: 'email' })
  @Property({ type: 'string', length: 250 })
  email!: string;

  @Property({ type: 'string', length: 100, nullable: true, hidden: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Property({ type: 'number', columnType: 'double' })
  lat!: number;

  @Property({ type: 'number', columnType: 'double' })
  lng!: number;

  @Property({ type: 'number', hidden: true, default: 1 })
  @Exclude()
  role: Opt<number> = 1;

  @Property({ type: 'string', length: 200 })
  photo!: string;

  @Property({ type: 'string', fieldName: 'idGoogle', length: 100, nullable: true, hidden: true })
  @Exclude({ toPlainOnly: true })
  idGoogle?: string;

  @Property({ type: 'string', fieldName: 'idFacebook', length: 100, nullable: true, hidden: true })
  @Exclude({ toPlainOnly: true })
  idFacebook?: string;

  @Property({ type: 'string', fieldName: 'firebaseToken', length: 200, nullable: true, hidden: true })
  @Exclude({ toPlainOnly: true })
  firebaseToken?: string;

  @ManyToMany({
    entity: () => Product,
    pivotEntity: () => ProductBookmark,
  })
  @Exclude()
  bookmarks = new Collection<Product>(this);

  @Property({ type: 'boolean', persist: false })
  me?: boolean;
}

