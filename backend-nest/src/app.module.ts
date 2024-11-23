import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { ProffessorModule } from './proffessor/proffessor.module';
import { SchoolModule } from './school/school.module';
import { PostModule } from './post/post.module';
import { NotesModule } from './notes/notes.module';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    PassportModule.register({
      session: true,
    }),
    ProffessorModule,
    SchoolModule,
    PostModule,
    NotesModule,
    SearchModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 2,
      },
    ]),
  ],
  controllers: [],
  providers: [ThrottlerGuard],
})
export class AppModule {}
