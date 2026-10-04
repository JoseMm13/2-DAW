import {
  IsString,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsUserAlreadyExist } from '../validators/user-exists.validator.js';

export class RegisterUserDto {
  /**
   * Nombre completo del nuevo usuario
   * @example "Carlos Ruiz"
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  readonly name!: string;

  /**
   * Dirección de correo electrónico única
   * @example "carlos.ruiz@ejemplo.com"
   */
  @IsEmail()
  @IsNotEmpty()
  @IsUserAlreadyExist({
    message: 'Email $value is already present in the database',
  })
  readonly email!: string;

  /**
   * Contraseña de acceso (mínimo 8 caracteres)
   * @example "PasswordSegura123!"
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  /**
   * Imagen de avatar en formato Base64
   * @example "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
   */
  @IsString()
  @IsNotEmpty()
  @Transform((v) =>
    typeof v.value === 'string'
      ? v.value.split(',')[1] || v.value
      : (v.value as string),
  )
  avatar!: string;

  /**
   * Latitud geográfica para ubicación por cercanía
   * @example 38.3854
   */
  @IsNumber()
  @IsLatitude()
  @IsOptional()
  lat = 0;

  /**
   * Longitud geográfica para ubicación por cercanía
   * @example -0.5186
   */
  @IsNumber()
  @IsLongitude()
  @IsOptional()
  lng = 0;

  /**
   * Token FCM para notificaciones push en Firebase
   * @example "fcm_token_sample_abc123"
   */
  @IsString()
  @IsOptional()
  readonly firebaseToken?: string;
}
