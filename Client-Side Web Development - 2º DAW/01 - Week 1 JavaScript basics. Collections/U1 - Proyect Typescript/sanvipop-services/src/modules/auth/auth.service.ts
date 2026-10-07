import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { URLSearchParams } from 'url';
import { ImageService } from '../../common/services/image/image.service.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { LoginTokenDto } from './dto/login-token.dto.js';
import { RegisterResponse } from './interfaces/register-response.js';
import { TokenResponse } from './interfaces/token-response.js';
import { GOOGLE_ID } from './interfaces/providers.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(GOOGLE_ID) private readonly googleId: string,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
    private readonly imageService: ImageService,
    private readonly usersService: UsersService,
  ) {}

  private createToken(user: User): TokenResponse {
    const data: JwtPayload = {
      id: user.id,
    };
    const accessToken = this.jwtService.sign(data);
    return { accessToken };
  }

  async registerUser(userDto: RegisterUserDto): Promise<RegisterResponse> {
    const photo = await this.imageService.saveImage('users', userDto.avatar);
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = this.userRepo.create({
      name: userDto.name,
      email: userDto.email,
      password: hashedPassword,
      photo,
      lat: userDto.lat ?? 0,
      lng: userDto.lng ?? 0,
      firebaseToken: userDto.firebaseToken,
    });
    this.userRepo.getEntityManager().persist(user);
    await this.userRepo.getEntityManager().flush();
    return { email: userDto.email };
  }

  async login(userDto: LoginUserDto): Promise<TokenResponse> {
    const user = await this.userRepo.findOne({
      email: userDto.email,
    });
    if (!user || !user.password || !(await bcrypt.compare(userDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (userDto.firebaseToken) {
      user.firebaseToken = userDto.firebaseToken;
    }
    if (userDto.lat && userDto.lng) {
      user.lat = userDto.lat;
      user.lng = userDto.lng;
    }
    await this.userRepo.getEntityManager().flush();
    return this.createToken(user);
  }

  async loginGoogle(tokenDto: LoginTokenDto): Promise<TokenResponse> {
    const client = new OAuth2Client(this.googleId);
    const ticket = await client.verifyIdToken({
      idToken: tokenDto.token,
      audience: this.googleId,
    });
    const payload = ticket.getPayload()!;
    const email = payload.email!;
    let user = await this.usersService.getUserbyEmail(email);

    if (!user) {
      const avatar = await this.imageService.downloadImage(
        'users',
        payload.picture!,
      );
      const newUser = this.userRepo.create({
        email,
        name: payload.name ?? 'Unknown',
        photo: avatar,
        lat: tokenDto.lat ?? 0,
        lng: tokenDto.lng ?? 0,
      });
      this.userRepo.getEntityManager().persist(newUser);
      await this.userRepo.getEntityManager().flush();
      user = (await this.usersService.getUserbyEmail(email))!;
    }

    if (tokenDto.firebaseToken) {
      user.firebaseToken = tokenDto.firebaseToken;
    }

    if (tokenDto.lat && tokenDto.lng) {
      user.lat = tokenDto.lat;
      user.lng = tokenDto.lng;
    }
    await this.userRepo.getEntityManager().flush();

    return this.createToken(user);
  }

  async loginFacebook(tokenDto: LoginTokenDto): Promise<TokenResponse> {
    const resp = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token: tokenDto.token,
        fields: 'id,name,email',
      },
    });

    const respUser = resp.data as { id: string; name: string; email: string };

    let user = await this.usersService.getUserbyEmail(respUser.email);

    if (!user) {
      const paramsImg = new URLSearchParams({
        access_token: tokenDto.token,
        type: 'large',
      });
      const respImg = (
        await axios.get('https://graph.facebook.com/me/picture', {
          params: paramsImg,
          responseType: 'arraybuffer',
        })
      ).data as Buffer;
      const avatar = await this.imageService.saveImageBinary('users', respImg);
      const newUser = this.userRepo.create({
        email: respUser.email,
        name: respUser.name,
        photo: avatar,
        lat: tokenDto.lat ?? 0,
        lng: tokenDto.lng ?? 0,
      });
      this.userRepo.getEntityManager().persist(newUser);
      await this.userRepo.getEntityManager().flush();
      user = (await this.usersService.getUserbyEmail(respUser.email))!;
    }

    if (tokenDto.firebaseToken) {
      user.firebaseToken = tokenDto.firebaseToken;
    }

    if (tokenDto.lat && tokenDto.lng) {
      user.lat = tokenDto.lat;
      user.lng = tokenDto.lng;
    }
    await this.userRepo.getEntityManager().flush();

    return this.createToken(user);
  }

  async logout(authUser: User): Promise<void> {
    authUser.firebaseToken = undefined;
    await this.userRepo.getEntityManager().flush();
  }
}
