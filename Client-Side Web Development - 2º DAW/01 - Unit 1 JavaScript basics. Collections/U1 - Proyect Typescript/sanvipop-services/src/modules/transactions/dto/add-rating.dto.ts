import { IsNumber, IsString, IsNotEmpty, Length, Min, Max } from 'class-validator';

export class AddRatingDto {
  /**
   * Puntuación asignada a la transacción (de 1 a 5 estrellas)
   * @example 5
   */
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  /**
   * Comentario o reseña sobre la experiencia con el usuario
   * @example "Excelente vendedor, el producto estaba impecable y la entrega fue puntual."
   */
  @IsString()
  @IsNotEmpty()
  @Length(3, 2000)
  comment!: string;

  /**
   * Identificador del producto asociado a la transacción
   * @example 1
   */
  @IsNumber()
  @Min(1)
  product!: number;
}