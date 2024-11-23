import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/services/mail-service.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { UserDetails } from './dto/user-details.dto';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  signToken(payload: TokenDto) {
    return this.jwtService.sign(payload);
  }

  async verifyRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.findUserById(userId);
      const isValidRefreshToken = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isValidRefreshToken)
        throw new UnauthorizedException('Invalid credentials');

      return user;
    } catch (error) {
      throw new UnauthorizedException('Refresh token is not valid');
    }
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      const authenticated = await bcrypt.compare(password, user.password);

      if (!authenticated) throw new NotFoundException('Invalid credentials');

      return user;
    } catch (error) {
      throw new UnauthorizedException('Credential are not valid');
    }
  }

  async validateUser(userDetails: UserDetails) {
    const user = await this.prisma.user.findFirst({
      where: { email: userDetails.email },
    });

    if (user) return user;

    console.log('User not found, creating new user');
    const newUser = await this.prisma.user.create({
      data: {
        email: userDetails.email,
        displayName: userDetails.displayName,
      },
    });

    return {
      newUser,
      accessToken: this.jwtService.sign({
        email: userDetails.email,
        userId: newUser.id,
      }),
    };
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async registerUser(userDto: UserDetails, response: Response) {
    try {
      const { password, email } = userDto;
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('This email is already registered');
      }
      if (!password) {
        throw new BadRequestException('Password is required');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: { ...userDto, password: hashedPassword },
      });

      const tokenPayload: TokenPayload = {
        userId: user.id,
      };

      const accessToken = this.jwtService.sign(tokenPayload, {
        secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`,
      });

      // Configura la cookie con el token
      const expiresAccessToken = new Date();
      expiresAccessToken.setMilliseconds(
        expiresAccessToken.getTime() +
          parseInt(
            this.configService.getOrThrow<string>(
              'JWT_ACCESS_TOKEN_EXPIRATION_MS',
            ),
          ),
      );

      response.cookie('Authentication', accessToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: expiresAccessToken,
      });

      return {
        user,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(user: User, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`,
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS')}ms`,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: await bcrypt.hash(refreshToken, 10),
      },
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
    });

    return { accessToken, refreshToken };
  }

  async forgotPassword(email: LoginDto['email']) {
    // esta funcion se va a hacer cargo de mandar el codigo a su correo del usuario
    const userEmail = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!userEmail)
      throw new BadRequestException(
        'User not found, you might want to create an account',
      );

    //creamos el codigo de recuperacion
    const token = crypto.randomBytes(3).toString('hex');
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1); // expira en una hora

    await this.prisma.user.update({
      where: { id: userEmail.id },
      data: {
        resetPasswordToken: await bcrypt.hash(token, 10),
        resetPasswordTokenExpiresAt: tokenExpiration,
      },
    });

    return await this.mailService.sendEmail({
      to: email,
      subject: 'Password reset',
      text: `Your password reset code is: ${token}`,
    });
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    const validToken = bcrypt.compare(token, user.resetPasswordToken);

    if (!validToken) {
      throw new BadRequestException('Invalid token, try again');
    }

    const today = new Date();
    if (
      user.resetPasswordTokenExpiresAt &&
      today > user.resetPasswordTokenExpiresAt
    ) {
      throw new BadRequestException('Token expired, try again');
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: newPasswordHashed,
        resetPasswordTokenExpiresAt: null, // limpiamos el token de expiracion
        resetPasswordToken: null, // limpiamos el token
      },
    });

    return { msg: 'Password updated successfully' };
  }
}
