import { Module, type OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/core';
import databaseConfig from './config/database.config.js';
import appConfig from './config/app.config.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { TransactionsModule } from './modules/transactions/transactions.module.js';
import { CommonModule } from './common/common.module.js';
import { Category } from './modules/categories/entities/category.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    MikroOrmModule.forRoot(databaseConfig),
    AuthModule.forRoot({
      googleId: process.env.GOOGLE_ID || '',
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    TransactionsModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    const conn = this.orm.em.getConnection() as any;
    if (conn?.database && typeof conn.database.function === 'function') {
      conn.database.function(
        'haversine',
        (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const toRad = (x: number) => (x * Math.PI) / 180;
          const R = 6371; // km
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
              Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        },
      );
    }

    // Seed default categories if none exist
    try {
      const forkEm = this.orm.em.fork();
      const count = await forkEm.count(Category);
      if (count === 0) {
        const defaultCategories = [
          { id: 1, name: 'Informática' },
          { id: 2, name: 'Telefonía' },
          { id: 3, name: 'Hogar' },
          { id: 4, name: 'Deportes' },
          { id: 5, name: 'Motor' },
          { id: 6, name: 'Moda' },
          { id: 7, name: 'Juegos' },
          { id: 8, name: 'Otros' },
        ];
        for (const cat of defaultCategories) {
          forkEm.create(Category, cat);
        }
        await forkEm.flush();
      }
    } catch {
      // Ignore if table not yet initialized (e.g. during schema migration/tests)
    }
  }
}
