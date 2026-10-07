import type { Request } from 'express';

/**
 * Añade la URL base del servidor a una ruta relativa de imagen (de producto o de usuario).
 * Si la URL ya es absoluta (comienza con http:// o https://), se devuelve sin modificar.
 *
 * @param req Objeto Request de Express para obtener protocolo y host
 * @param partialUrl Ruta parcial o relativa de la imagen (ej: "img/products/123.jpg")
 * @returns URL absoluta completa (ej: "http://localhost:3000/img/products/123.jpg")
 */
export function buildFullImageUrl(
  req?: Request,
  partialUrl?: string | null,
): string {
  if (!partialUrl) {
    return '';
  }

  if (partialUrl.startsWith('http://') || partialUrl.startsWith('https://')) {
    return partialUrl;
  }

  const basePath = process.env.BASE_PATH ? `${process.env.BASE_PATH}/` : '';
  const protocol = req?.protocol || 'http';
  const host =
    req?.get?.('host') || req?.headers?.host || 'localhost:3000';
  const cleanUrl = partialUrl.startsWith('/')
    ? partialUrl.slice(1)
    : partialUrl;

  return `${protocol}://${host}/${basePath}${cleanUrl}`;
}

