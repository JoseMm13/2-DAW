import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { AuthUser } from '../../common/decorators/user.decorator.js';
import { User } from '../users/entities/user.entity.js';
import { AddRatingDto } from './dto/add-rating.dto.js';
import { TransactionsService } from './transactions.service.js';
import { type RatingResponses } from './interfaces/rating-response.js';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('ratings')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('user/me')
  @ApiOperation({ summary: 'Get ratings for current user' })
  @ApiResponse({ status: 200, description: 'User rating list' })
  async getMyRatings(@AuthUser() authUser: User): Promise<RatingResponses> {
    return await this.transactionsService.getUserRatings(authUser.id);
  }

  @Get('user/:idUser')
  @ApiOperation({ summary: 'Get ratings for specified user by ID' })
  @ApiResponse({ status: 200, description: 'User rating list' })
  async getUserRatings(
    @Param('idUser', ParseIntPipe) idUser: number,
  ): Promise<RatingResponses> {
    return this.transactionsService.getUserRatings(idUser);
  }

  @Post()
  @HttpCode(204)
  @ApiOperation({ summary: 'Create a transaction rating for a sold product' })
  @ApiResponse({ status: 204, description: 'Rating added successfully' })
  @ApiResponse({ status: 403, description: 'Transaction already rated or user not involved' })
  async createTransaction(
    @AuthUser() authUser: User,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    ratingDto: AddRatingDto,
  ): Promise<void> {
    try {
      await this.transactionsService.addRating(ratingDto, authUser);
    } catch (e: any) {
      if (
        e instanceof UniqueConstraintViolationException ||
        e?.code === 'ER_DUP_ENTRY' ||
        e?.code === 'SQLITE_CONSTRAINT'
      ) {
        throw new ForbiddenException(
          "You can't rate a product transaction more than once",
        );
      } else {
        throw e;
      }
    }
  }
}
