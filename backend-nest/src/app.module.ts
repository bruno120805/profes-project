import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProffessorModule } from './proffessor/proffessor.module';
import { SchoolModule } from './school/school.module';
import { SearchModule } from './search/search.module';

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
        limit: 10,
      },
    ]),
  ],
  controllers: [],
  providers: [ThrottlerGuard],
})
export class AppModule {}
