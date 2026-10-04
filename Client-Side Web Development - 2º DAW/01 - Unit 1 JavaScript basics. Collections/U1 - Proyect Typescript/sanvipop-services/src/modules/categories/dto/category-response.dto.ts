import type { Category } from '../entities/category.entity.js';

export class CategoryResponseDto {
  /**
   * Identificador de la categoría
   * @example 1
   */
  id!: number;

  /**
   * Nombre de la categoría
   * @example "Informática"
   */
  name!: string;

  static fromEntity(category: Category): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = category.id;
    dto.name = category.name;
    return dto;
  }
}

export class CategoriesResponseDto {
  /**
   * Listado de categorías disponibles
   */
  categories!: CategoryResponseDto[];

  static from(categories: Category[]): CategoriesResponseDto {
    const dto = new CategoriesResponseDto();
    dto.categories = categories.map((c) => CategoryResponseDto.fromEntity(c));
    return dto;
  }
}
