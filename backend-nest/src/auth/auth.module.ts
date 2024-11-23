import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/services/mail-service.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/GoogleStrategy';
import { SessionSerializer } from './strategies/Serializer';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [
    ConfigService,
    SessionSerializer,
    GoogleStrategy,
    AuthService,
    JwtStrategy,
    PrismaService,
    MailService,
    LocalStrategy,
    JwtRefreshStrategy,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  exports: [JwtStrategy, PassportModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
