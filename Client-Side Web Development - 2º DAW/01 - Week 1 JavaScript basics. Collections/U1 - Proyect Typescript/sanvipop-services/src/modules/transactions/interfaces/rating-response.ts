import { User } from '../../users/entities/user.entity.js';
import { Product } from '../../products/entities/product.entity.js';

export interface RatingResponse {
  user: User;
  product: Product;
  rating?: number | null;
  comment?: string | null;
}

export interface RatingResponses {
  ratings: RatingResponse[];
}