import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/services/mail-service.service';

@Module({
  imports: [AuthModule],
  controllers: [SchoolController],
  providers: [SchoolService, PrismaService, AuthService, MailService],
})
export class SchoolModule {}
