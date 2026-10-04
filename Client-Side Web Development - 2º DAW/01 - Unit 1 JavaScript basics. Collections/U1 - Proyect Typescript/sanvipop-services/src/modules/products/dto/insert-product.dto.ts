import { IsString, IsNotEmpty, IsInt, IsNumber, IsPositive, Length } from 'class-validator';

export class InsertProductDto {
  /**
   * Título descriptivo del producto
   * @example "Bicicleta de montaña 29 pulgadas"
   */
  @IsString()
  @IsNotEmpty()
  @Length(3, 250)
  title!: string;

  /**
   * Descripción detallada del producto y su estado
   * @example "Bicicleta en excelente estado, frenos de disco hidráulicos y cambio Shimano."
   */
  @IsString()
  @IsNotEmpty()
  @Length(10, 2000)
  description!: string;

  /**
   * Identificador de la categoría a la que pertenece el producto
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  category!: number;

  /**
   * Precio de venta en euros
   * @example 199.99
   */
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price!: number;

  /**
   * Imagen principal del producto en formato Base64
   * @example "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
   */
  @IsString()
  @IsNotEmpty()
  mainPhoto!: string;
}