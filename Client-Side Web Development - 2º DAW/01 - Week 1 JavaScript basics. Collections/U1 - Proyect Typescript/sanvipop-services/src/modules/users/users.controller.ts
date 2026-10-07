import {
  Controller,
  Get,
  Req,
  Param,
  ParseIntPipe,
  Put,
  Body,
  ValidationPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { UpdatePhotoDto } from './dto/update-photo.dto.js';
import { AuthUser } from '../../common/decorators/user.decorator.js';
import { User } from './entities/user.entity.js';
import {
  SingleUserResponseDto,
  UsersResponseDto,
  AvatarResponseDto,
} from './dto/user-response.dto.js';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get profile of current logged-in user' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  getCurrentUser(
    @AuthUser() authUser: User,
    @Req() req?: Request,
  ): SingleUserResponseDto {
    return SingleUserResponseDto.from(authUser, req, true);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Search users by name substring' })
  @ApiResponse({ status: 200, description: 'Matching users list' })
  async getUsersByName(
    @AuthUser() authUser: User,
    @Param('name') name: string,
    @Req() req?: Request,
  ): Promise<UsersResponseDto> {
    const users = await this.usersService.getUsersByName(name);
    return UsersResponseDto.from(users, req, authUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(
    @AuthUser() authUser: User,
    @Param('id', ParseIntPipe) id: number,
    @Req() req?: Request,
  ): Promise<SingleUserResponseDto> {
    const user = await this.usersService.getUser(id);
    return SingleUserResponseDto.from(user, req, id === authUser.id);
  }

  @Put('me')
  @HttpCode(204)
  @ApiOperation({ summary: 'Update profile information of current user' })
  @ApiResponse({ status: 204, description: 'User updated' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async updateUserInfo(
    @AuthUser() authUser: User,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    userDto: UpdateUserDto,
  ): Promise<void> {
    await this.usersService.updateUserInfo(authUser.id, userDto);
  }

  @Put('me/password')
  @HttpCode(204)
  @ApiOperation({ summary: 'Update password of current user' })
  @ApiResponse({ status: 204, description: 'Password updated' })
  async updatePassword(
    @AuthUser() authUser: User,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    passDto: UpdatePasswordDto,
  ): Promise<void> {
    await this.usersService.updatePassword(authUser.id, passDto);
  }

  @Put('me/photo')
  @ApiOperation({ summary: 'Update avatar photo of current user' })
  @ApiResponse({ status: 200, description: 'New photo URL' })
  async updateAvatar(
    @AuthUser() authUser: User,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    photoDto: UpdatePhotoDto,
    @Req() req?: Request,
  ): Promise<AvatarResponseDto> {
    const photo = await this.usersService.updatePhoto(authUser.id, photoDto);
    return AvatarResponseDto.from(photo, req);
  }
}
