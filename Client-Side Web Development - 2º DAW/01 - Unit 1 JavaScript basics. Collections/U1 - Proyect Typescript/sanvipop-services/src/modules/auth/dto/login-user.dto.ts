import {
  IsEmail,
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class LoginUserDto {
  /**
   * Correo electrónico registrado
   * @example "carlos.ruiz@ejemplo.com"
   */
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  /**
   * Contraseña de acceso
   * @example "PasswordSegura123!"
   */
  @IsString()
  @IsNotEmpty()
  readonly password!: string;

  /**
   * Token FCM opcional para actualizar las notificaciones push
   * @example "fcm_token_sample_abc123"
   */
  @IsString()
  @IsOptional()
  readonly firebaseToken?: string;

  /**
   * Latitud geográfica actualizada
   * @example 38.3854
   */
  @IsNumber()
  @IsOptional()
  lat?: number;

  /**
   * Longitud geográfica actualizada
   * @example -0.5186
   */
  @IsNumber()
  @IsOptional()
  lng?: number;
}
