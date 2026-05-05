import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthenticatedRequest } from '../../common/types/authenticated-request';

const getAuthCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  };
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(createUserDto);
    response.cookie('access_token', result.access_token, getAuthCookieOptions());

    return {
      data: result,
      message: 'success',
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    response.cookie('access_token', result.access_token, getAuthCookieOptions());

    return {
      data: result,
      message: 'success',
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(forgotPasswordDto);

    return {
      data: result,
      message: 'If an account exists for that email, a password reset link has been created.',
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(resetPasswordDto);

    return {
      data: null,
      message: result.message,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() request: AuthenticatedRequest) {
    return {
      data: request.user,
      message: 'success',
    };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.refresh({
      id: request.user.id,
      email: request.user.email || '',
      firstName: request.user.firstName ?? null,
      lastName: request.user.lastName ?? null,
      createdAt: request.user.createdAt || new Date(),
      updatedAt: request.user.updatedAt || new Date(),
    });

    response.cookie('access_token', result.access_token, getAuthCookieOptions());

    return {
      data: result,
      message: 'success',
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    const { maxAge, ...clearOptions } = getAuthCookieOptions();
    response.clearCookie('access_token', clearOptions);
    return {
      data: null,
      message: 'success',
    };
  }
}
