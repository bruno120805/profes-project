import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDetails } from './dto/user-details.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { MailService } from 'src/services/mail-service.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  signToken(payload: TokenDto) {
    return this.jwtService.sign(payload);
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

    return user;
  }

  async registerUser(userDto: UserDetails) {
    try {
      const { password, email } = userDto;
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('This email is already registered');
      }
      if (!userDto.password) {
        throw new BadRequestException('Password is required');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: { ...userDto, password: hashedPassword },
      });

      const refreshToken = await this.generateRefreshToken(user.id);

      return {
        user,
        accessToken: this.jwtService.sign({
          email: user.email,
          userId: user.id,
        }),
        refreshToken,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user || !user.password) {
        throw new BadRequestException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }

      const refreshToken = await this.generateRefreshToken(user.id);

      return {
        user,
        accessToken: this.jwtService.sign({
          email: user.email,
          userId: user.id,
        }),
        refreshToken,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async generateRefreshToken(userId: string) {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt },
    });
    return refreshToken;
  }

  async renewAccessToken(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    const newAccessToken = this.jwtService.sign({
      email: user.email,
      userId: user.id,
    });
    return { accessToken: newAccessToken };
  }

  async forgotPassword(email: LoginDto['email']) {
    // esta funcion se va a hacer cargo de mandar el codigo a su correo del usuario
    const userEmail = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!userEmail)
      throw new BadRequestException(
        'User not found, you might want to create one',
      );

    //creamos el codigo de recuperacion
    const token = crypto.randomBytes(4).toString('hex');
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1); // expira en una hora

    await this.prisma.user.update({
      where: { email },
      data: {
        expirationToken: token,
        expirationTokenDate: tokenExpiration,
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

    if (user.expirationToken !== token) {
      throw new BadRequestException('Invalid token, try again');
    }

    const today = new Date();
    if (user.expirationTokenDate && today > user.expirationTokenDate) {
      throw new BadRequestException('Token expired, try again');
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: newPasswordHashed,
        expirationTokenDate: null, // limpiamos el token de expiracion
        expirationToken: null, // limpiamos el token
      },
    });

    return { msg: 'Password updated successfully' };
  }
}
