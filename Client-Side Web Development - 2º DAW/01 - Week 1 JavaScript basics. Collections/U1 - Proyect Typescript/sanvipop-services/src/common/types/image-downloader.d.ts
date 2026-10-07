declare module 'image-downloader' {
  export interface ImageOptions {
    url: string;
    dest: string;
    timeout?: number;
    maxRedirects?: number;
    headers?: Record<string, string>;
  }

  export interface ImageResult {
    filename: string;
  }

  export function image(options: ImageOptions): Promise<ImageResult>;
}

