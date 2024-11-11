import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { ProffessorModule } from './proffessor/proffessor.module';
import { SchoolModule } from './school/school.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    PassportModule.register({
      session: true,
    }),
    ProffessorModule,
    SchoolModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}