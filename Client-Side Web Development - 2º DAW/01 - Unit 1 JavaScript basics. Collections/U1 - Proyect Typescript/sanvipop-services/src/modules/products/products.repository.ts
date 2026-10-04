import { QueryOrder, raw, type FilterQuery, type QueryOrderMap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/sql';
import { Product } from './entities/product.entity.js';

export class ProductsRepository extends EntityRepository<Product> {
  public findByDistance(
    lat = 0,
    lng = 0,
    idLogged = 1,
    where: FilterQuery<Product> | null = { $not: { status: 3 } },
    orderBy: QueryOrderMap<Product> = { distance: QueryOrder.ASC },
    joins: Map<string, any> | null = null,
    limit?: number,
    offset?: number,
  ): Promise<Product[]> {
    let qb = this.em
      .createQueryBuilder(Product, 'p')
      .select([
        'p.*',
        't.idProduct as rating',
        raw(`haversine(u.lat, u.lng, ${lat}, ${lng}) AS distance`),
        raw(`exists(SELECT 1 FROM product_bookmark pb WHERE pb.idUser = ${idLogged} AND pb.idProduct = p.id) AS bookmarked`),
      ] as any)
      .join('p.owner', 'u')
      .leftJoin('p.rating', 't');

    if (where) {
      qb = qb.where(where as any);
    }

    if (joins) {
      for (const join of joins.keys()) {
        qb = qb.join(('p.' + join) as any, join, joins.get(join));
      }
    }

    if (orderBy) {
      qb = qb.orderBy(orderBy);
    }

    if (limit !== undefined) {
      qb = qb.limit(limit);
    }

    if (offset !== undefined) {
      qb = qb.offset(offset);
    }

    return qb.getResult();
  }

  public findById(
    idProduct: number,
    idLogged: number,
    lat = 0,
    lng = 0,
  ): Promise<Product | null> {
    return this.em
      .createQueryBuilder(Product, 'p')
      .select([
        'p.*',
        raw(`haversine(u.lat, u.lng, ${lat}, ${lng}) AS distance`),
        raw(`exists(SELECT 1 FROM product_bookmark pb WHERE pb.idUser = ${idLogged} AND pb.idProduct = p.id) AS bookmarked`),
      ] as any)
      .join('p.owner', 'u')
      .where({ id: idProduct })
      .getSingleResult();
  }
}