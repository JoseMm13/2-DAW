import type { Request } from 'express';
import { User } from '../entities/user.entity.js';
import { buildFullImageUrl } from '../../../common/utils/image-url.util.js';

export class UserResponseDto {
  /**
   * Identificador único del usuario
   * @example 1
   */
  id!: number;

  /**
   * Nombre completo del usuario
   * @example "Juan Pérez"
   */
  name!: string;

  /**
   * Correo electrónico único del usuario
   * @example "juan.perez@sanvipop.es"
   */
  email!: string;

  /**
   * Latitud geográfica de ubicación
   * @example 38.4018
   */
  lat!: number;

  /**
   * Longitud geográfica de ubicación
   * @example -0.5241
   */
  lng!: number;

  /**
   * URL absoluta de la fotografía de perfil
   * @example "http://localhost:3000/img/users/avatar.jpg"
   */
  photo!: string;

  /**
   * Fecha de registro del usuario
   * @example "2026-03-01T12:00:00.000Z"
   */
  registrationDate!: Date;

  /**
   * Indica si este perfil corresponde al usuario autenticado
   * @example true
   */
  me!: boolean;

  /**
   * Método estático para instanciar UserResponseDto a partir de la entidad User
   */
  static fromEntity(
    user: User,
    req?: Request,
    isMe?: boolean,
  ): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.lat = user.lat;
    dto.lng = user.lng;
    dto.photo = buildFullImageUrl(req, user.photo);
    dto.registrationDate = user.registrationDate;
    dto.me = isMe !== undefined ? isMe : Boolean(user.me);
    return dto;
  }
}

export class SingleUserResponseDto {
  /**
   * Datos del usuario
   */
  user!: UserResponseDto;

  static from(user: User, req?: Request, isMe?: boolean): SingleUserResponseDto {
    const dto = new SingleUserResponseDto();
    dto.user = UserResponseDto.fromEntity(user, req, isMe);
    return dto;
  }
}

export class UsersResponseDto {
  /**
   * Lista de usuarios encontrados
   */
  users!: UserResponseDto[];

  static from(
    users: User[],
    req?: Request,
    authUserId?: number,
  ): UsersResponseDto {
    const dto = new UsersResponseDto();
    dto.users = users.map((u) =>
      UserResponseDto.fromEntity(u, req, authUserId !== undefined ? u.id === authUserId : undefined),
    );
    return dto;
  }
}

export class AvatarResponseDto {
  /**
   * URL absoluta de la foto actualizada
   * @example "http://localhost:3000/img/users/1741818000-uuid.jpg"
   */
  photo!: string;

  static from(photoUrl: string, req?: Request): AvatarResponseDto {
    const dto = new AvatarResponseDto();
    dto.photo = buildFullImageUrl(req, photoUrl);
    return dto;
  }
}

export const toUserResponseDto = UserResponseDto.fromEntity;
