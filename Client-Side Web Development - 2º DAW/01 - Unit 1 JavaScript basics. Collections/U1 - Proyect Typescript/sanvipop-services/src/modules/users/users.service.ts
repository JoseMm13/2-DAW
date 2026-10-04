import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { UpdatePhotoDto } from './dto/update-photo.dto.js';
import { ImageService } from '../../common/services/image/image.service.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly imageService: ImageService,
    @InjectRepository(User) private readonly usersRepo: EntityRepository<User>,
  ) {}

  async getUser(id: number): Promise<User> {
    return this.usersRepo.findOneOrFail({ id });
  }

  async getUserbyEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ email });
  }

  async getUsersByName(name: string): Promise<User[]> {
    return this.usersRepo.find({ name: { $like: '%' + name + '%' } });
  }

  async emailExists(email: string): Promise<boolean> {
    return (await this.usersRepo.count({ email })) > 0;
  }

  async updateUserInfo(id: number, user: UpdateUserDto): Promise<void> {
    await this.usersRepo.nativeUpdate({ id }, user);
  }

  async updatePassword(id: number, pass: UpdatePasswordDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(pass.password, 10);
    await this.usersRepo.nativeUpdate({ id }, { password: hashedPassword });
  }

  async updatePhoto(id: number, avatar: UpdatePhotoDto): Promise<string> {
    avatar.photo = await this.imageService.saveImage('users', avatar.photo);
    await this.usersRepo.nativeUpdate({ id }, avatar);
    return avatar.photo;
  }
}
