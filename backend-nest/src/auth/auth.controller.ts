import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserDetails } from './dto/user-details.dto';
import { GoogleAuthGuard } from './guard/google.guard';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  //api/auth/google/redirect
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  handleRedirect() {
    return { msg: 'ok' };
  }

  @Get('status')
  user(@Req() request: Request) {
    return request.user
      ? { msg: 'authenticated' }
      : { msg: 'not authenticated' };
  }

  @Post('register')
  register(
    @Body() userDto: UserDetails,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.registerUser(userDto, response);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @GetCurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshToken(
    @GetCurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 5000, blockDuration: 10000 } })
  @Post('forgot-password')
  forgotPassword(@Body('email') email: LoginDto['email']) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(
    @Body()
    { email, token, newPassword }: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(email, token, newPassword);
  }
}
