// src/api/products.ts
import { apiFetch } from './config';

export interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  sellerId: number;
  sold: boolean;
}

export interface ProductsResponse {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
}

export async function getProducts(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: number;
  bookmarked?: boolean;
  status?: 'selling' | 'sold' | 'bought';
}): Promise<ProductsResponse> {
  const query = new URLSearchParams();

  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.search) query.set('search', params.search);
  if (params.minPrice != null) query.set('minPrice', String(params.minPrice));
  if (params.maxPrice != null) query.set('maxPrice', String(params.maxPrice));
  if (params.sellerId != null) query.set('sellerId', String(params.sellerId));
  if (params.bookmarked) query.set('bookmarked', 'true');
  if (params.status) query.set('status', params.status);

  return apiFetch<ProductsResponse>(`/products?${query.toString()}`);
}
