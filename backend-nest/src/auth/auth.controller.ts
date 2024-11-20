import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserDetails } from './dto/user-details.dto';
import { GoogleAuthGuard } from './guard/google.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
  register(@Body() userDto: UserDetails) {
    return this.authService.registerUser(userDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('refresh-token') async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.renewAccessToken(refreshToken);
  }

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
