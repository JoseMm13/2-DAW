import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import * as download from 'image-downloader';

@Injectable()
export class ImageService {
  async saveImage(dir: string, photo: string): Promise<string> {
    let extension = 'jpg';
    let data = photo;

    const commaIndex = photo.indexOf(',');
    if (commaIndex !== -1) {
      const header = photo.substring(0, commaIndex);
      data = photo.substring(commaIndex + 1);
      extension = this.getExtensionFromHeader(header);
    }

    const filename = `${Date.now()}-${randomUUID()}.${extension}`;
    const targetDir = path.join('img', dir);
    await fs.mkdir(targetDir, { recursive: true });
    const filePath = path.join(targetDir, filename);
    await fs.writeFile(filePath, Buffer.from(data, 'base64'));
    return `img/${dir}/${filename}`;
  }

  private getExtensionFromHeader(header: string): string {
    const match = header.trim().match(/^data:image\/([a-zA-Z0-9+.-]+)/i);
    if (!match) {
      return 'jpg';
    }

    const mimeType = match[1].toLowerCase();
    switch (mimeType) {
      case 'jpeg':
      case 'jpg':
        return 'jpg';
      case 'svg+xml':
        return 'svg';
      case 'x-icon':
      case 'vnd.microsoft.icon':
        return 'ico';
      default:
        return mimeType;
    }
  }

  async saveImageBinary(dir: string, img: Buffer | string): Promise<string> {
    const filename = `${Date.now()}-${randomUUID()}.jpg`;
    const targetDir = path.join('img', dir);
    await fs.mkdir(targetDir, { recursive: true });
    const filePath = path.join(targetDir, filename);
    await fs.writeFile(filePath, img, 'binary');
    return `img/${dir}/${filename}`;
  }

  async downloadImage(dir: string, url: string): Promise<string> {
    const filename = `${Date.now()}-${randomUUID()}.jpg`;
    const targetDir = path.join(path.resolve('./'), 'img', dir);
    await fs.mkdir(targetDir, { recursive: true });
    const filePath = path.join(targetDir, filename);
    await download.image({
      url,
      dest: filePath,
    });
    return `img/${dir}/${filename}`;
  }

  async removeImage(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch {
      // Ignore if file doesn't exist
    }
  }
}
