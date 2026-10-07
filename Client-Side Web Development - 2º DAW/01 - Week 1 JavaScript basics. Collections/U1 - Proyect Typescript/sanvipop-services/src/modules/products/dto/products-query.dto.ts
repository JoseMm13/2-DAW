import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductSort {
  DISTANCE = 'distance',
  PRICE = 'price',
  VIEWS = 'views',
}

export class ProductsQueryDto {
  /**
   * Número de página para la paginación (por defecto 1, siempre 12 resultados por página)
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * Criterio de ordenación ascendente ('distance', 'price' o 'views'). Por defecto 'distance'.
   * @example "distance"
   */
  @IsOptional()
  @IsEnum(ProductSort)
  sort?: ProductSort = ProductSort.DISTANCE;

  /**
   * Cadena de texto para filtrar productos por título o descripción
   * @example "bicicleta"
   */
  @IsOptional()
  @IsString()
  search?: string;
}
