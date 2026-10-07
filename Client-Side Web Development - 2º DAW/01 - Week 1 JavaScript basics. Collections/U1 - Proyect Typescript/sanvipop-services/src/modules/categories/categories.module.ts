import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';
import { Category } from './entities/category.entity.js';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  providers: [CategoriesService],
  exports: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
