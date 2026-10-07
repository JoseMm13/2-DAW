import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { AuthUser } from '../../common/decorators/user.decorator.js';
import { LoginTokenDto } from './dto/login-token.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { RegisterResponse } from './interfaces/register-response.js';
import { TokenResponse } from './interfaces/token-response.js';
import { User } from '../users/entities/user.entity.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    userDto: RegisterUserDto,
  ): Promise<RegisterResponse> {
    return await this.authService.registerUser(userDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    userDto: LoginUserDto,
  ): Promise<TokenResponse> {
    try {
      return await this.authService.login(userDto);
    } catch {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Email or password incorrect',
      });
    }
  }

  @Post('google')
  @Public()
  @ApiOperation({ summary: 'Login with Google token' })
  @ApiResponse({ status: 200, description: 'JWT access token' })
  @ApiResponse({ status: 401, description: 'Google login failed' })
  async loginGoogle(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    tokenDto: LoginTokenDto,
  ): Promise<TokenResponse> {
    try {
      return await this.authService.loginGoogle(tokenDto);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Google login failed',
      });
    }
  }

  @Post('facebook')
  @Public()
  @ApiOperation({ summary: 'Login with Facebook token' })
  @ApiResponse({ status: 200, description: 'JWT access token' })
  @ApiResponse({ status: 401, description: 'Facebook login failed' })
  async loginFacebook(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    tokenDto: LoginTokenDto,
  ): Promise<TokenResponse> {
    try {
      return await this.authService.loginFacebook(tokenDto);
    } catch {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Facebook login failed',
      });
    }
  }

  @Get('validate')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate JWT token' })
  @ApiResponse({ status: 204, description: 'Token is valid' })
  validate(): void {
    // Valida el token
  }

  @Get('logout')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate firebase token' })
  @ApiResponse({ status: 204, description: 'Logged out successfully' })
  async logout(@AuthUser() authUser: User): Promise<void> {
    await this.authService.logout(authUser);
  }
}
