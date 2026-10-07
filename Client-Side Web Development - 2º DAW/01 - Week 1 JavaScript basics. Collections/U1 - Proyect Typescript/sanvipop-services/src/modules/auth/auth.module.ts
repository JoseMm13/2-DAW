import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { type AuthConfig, GOOGLE_ID, JWT_KEY } from './interfaces/providers.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { JwtStrategy } from './jwt.strategy.js';
import { IsUserAlreadyExistConstraint } from './validators/user-exists.validator.js';
import { User } from '../users/entities/user.entity.js';
import { UsersModule } from '../users/users.module.js';
import { CommonModule } from '../../common/common.module.js';

@Module({})
export class AuthModule {
  static forRoot(config: AuthConfig): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        MikroOrmModule.forFeature([User]),
        UsersModule,
        CommonModule,
        PassportModule,
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('jwtSecret') || 'super_secret_jwt_key_sanvipop_educational_2026',
            signOptions: {
              expiresIn: '7d',
            },
          }),
        }),
      ],
      controllers: [AuthController],
      providers: [
        IsUserAlreadyExistConstraint,
        AuthService,
        JwtStrategy,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: JWT_KEY,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.get<string>('jwtSecret') || 'super_secret_jwt_key_sanvipop_educational_2026',
        },
        {
          provide: GOOGLE_ID,
          useValue: config.googleId,
        },
      ],
      exports: [AuthService],
    };
  }
}
