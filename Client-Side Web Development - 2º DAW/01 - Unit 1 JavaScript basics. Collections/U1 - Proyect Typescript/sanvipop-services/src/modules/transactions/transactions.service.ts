import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Product, ProductStatus } from '../products/entities/product.entity.js';
import { ProductsRepository } from '../products/products.repository.js';
import { Transaction } from './entities/transaction.entity.js';
import { AddRatingDto } from './dto/add-rating.dto.js';
import { User } from '../users/entities/user.entity.js';
import { type RatingResponses } from './interfaces/rating-response.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductsRepository,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: EntityRepository<Transaction>,
  ) {}

  async getUserRatings(userId: number): Promise<RatingResponses> {
    const transactions = await this.transactionRepository.find(
      {
        $or: [
          { buyer: { id: userId }, $not: { sellerRating: null } },
          { seller: { id: userId }, $not: { buyerRating: null } },
        ],
      },
      { populate: ['product', 'seller', 'buyer'] },
    );
    return {
      ratings: transactions.map((t) => ({
        product: t.product,
        user: t.buyer.id === userId ? t.seller : t.buyer,
        comment: t.buyer.id === userId ? t.sellerComment : t.buyerComment,
        rating: t.buyer.id === userId ? t.sellerRating : t.buyerRating,
      })),
    };
  }

  async addRating(ratingDto: AddRatingDto, authUser: User): Promise<void> {
    const product = await this.productRepository.findOne({ id: ratingDto.product });
    if (!product) {
      throw new NotFoundException('Product not found');
    } else if (product.status !== ProductStatus.SOLD) {
      throw new ForbiddenException('You can only rate sold products');
    }

    let transaction = await this.transactionRepository.findOne(
      { product: ratingDto.product },
      { populate: ['seller', 'buyer', 'product'] },
    );
    if (!transaction) {
      const fullProd = await this.productRepository.findOneOrFail(
        { id: ratingDto.product },
        { populate: ['owner', 'soldTo'] },
      );
      transaction = new Transaction(fullProd);
    }

    if (transaction.seller.id === authUser.id) {
      if (transaction.sellerRating !== null && transaction.sellerRating !== undefined) {
        throw new ConflictException('You have already rated this transaction');
      }
      transaction.sellerRating = ratingDto.rating;
      transaction.sellerComment = ratingDto.comment;
    } else if (transaction.buyer.id === authUser.id) {
      if (transaction.buyerRating !== null && transaction.buyerRating !== undefined) {
        throw new ConflictException('You have already rated this transaction');
      }
      transaction.buyerRating = ratingDto.rating;
      transaction.buyerComment = ratingDto.comment;
    } else {
      throw new ForbiddenException('Your user is not involved in the transaction');
    }
    this.transactionRepository.getEntityManager().persist(transaction);
    await this.transactionRepository.getEntityManager().flush();
  }
}
