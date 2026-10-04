import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  /**
   * Nueva contraseña de acceso (mínimo 8 caracteres)
   * @example "NuevaPassword456!"
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password!: string;
}