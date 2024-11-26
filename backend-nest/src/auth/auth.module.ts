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
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 2000,
        limit: 3,
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${config.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`,
        },
      }),
    }),
  ],
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
