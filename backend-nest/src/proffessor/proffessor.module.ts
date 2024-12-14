import { Module } from '@nestjs/common';
import { ProffessorService } from './proffessor.service';
import { ProffessorController } from './proffessor.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/services/mail-service.service';
import { SchoolService } from 'src/school/school.service';

@Module({
  imports: [AuthModule],
  controllers: [ProffessorController],
  providers: [
    ProffessorService,
    PrismaService,
    AuthService,
    MailService,
    SchoolService,
  ],
})
export class ProffessorModule {}
