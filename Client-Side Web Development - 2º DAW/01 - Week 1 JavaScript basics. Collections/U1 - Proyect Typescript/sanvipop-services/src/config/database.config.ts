import { defineConfig, SqliteDriver } from '@mikro-orm/sql';
import { SqliteDialect } from 'kysely';
import { DatabaseSync } from 'node:sqlite';
import { User } from '../modules/users/entities/user.entity.js';
import { Category } from '../modules/categories/entities/category.entity.js';
import { Product } from '../modules/products/entities/product.entity.js';
import { ProductPhoto } from '../modules/products/entities/product-photo.entity.js';
import { ProductBookmark } from '../modules/products/entities/product-bookmark.entity.js';
import { Transaction } from '../modules/transactions/entities/transaction.entity.js';

/**
 * Registra la función matemática personalizada 'haversine' en la instancia SQLite.
 * Permite calcular la distancia esférica en kilómetros entre dos coordenadas (lat1, lon1) y (lat2, lon2).
 */
export function registerHaversine(db: DatabaseSync): void {
  db.function(
    'haversine',
    (lat1: any, lon1: any, lat2: any, lon2: any) => {
      if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
        return null;
      }
      const toRad = (x: number) => (x * Math.PI) / 180;
      const R = 6371; // km
      const dLat = toRad(Number(lat2) - Number(lat1));
      const dLon = toRad(Number(lon2) - Number(lon1));
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(Number(lat1))) *
          Math.cos(toRad(Number(lat2))) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
  );
}

/**
 * Dialecto SQLite basado en el módulo nativo 'node:sqlite' de Node 24+,
 * sin requerir compilación C++ (better-sqlite3) ni herramientas de compilación en Windows.
 */
export class NodeSqliteHaversineDialect extends SqliteDialect {
  constructor(dbName: string) {
    super({
      database: async () => {
        const db = new DatabaseSync(dbName);
        registerHaversine(db);
        return {
          prepare(sql: string) {
            const stmt = db.prepare(sql);
            return {
              reader: /^\s*(select|pragma|explain|with)/i.test(sql) || /\breturning\b/i.test(sql),
              all: (params: any[]) => stmt.all(...params),
              run: (params: any[]) => stmt.run(...params),
              get: (params: any[]) => stmt.get(...params),
              iterate: (params: any[]) => stmt.iterate(...params),
            };
          },
          close() {
            db.close();
          },
        };
      },
    });
  }
}

const dbName = 'sanvipop.db';

export default defineConfig({
  driver: SqliteDriver,
  dbName,
  driverOptions: new NodeSqliteHaversineDialect(dbName),
  entities: [User, Category, Product, ProductPhoto, ProductBookmark, Transaction],
  debug: process.env.NODE_ENV !== 'production',
});
