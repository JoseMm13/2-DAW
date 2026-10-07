import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class AddPhotoDto {
  /**
   * Foto en formato Base64
   * @example "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
   */
  @IsString()
  @IsNotEmpty()
  photo!: string;

  /**
   * Indica si esta foto debe establecerse como foto principal del producto
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  setMain = false;
}