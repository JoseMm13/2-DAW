import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Category } from './entities/category.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly catRepository: EntityRepository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.catRepository.findAll();
  }

  async findById(id: number): Promise<Category> {
    return this.catRepository.findOneOrFail({ id });
  }
}
