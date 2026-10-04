import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TransactionsService } from './transactions.service.js';
import { TransactionsController } from './transactions.controller.js';
import { Product } from '../products/entities/product.entity.js';
import { Transaction } from './entities/transaction.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [MikroOrmModule.forFeature([Product, User, Transaction])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
