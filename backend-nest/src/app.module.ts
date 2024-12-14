import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProffessorModule } from './proffessor/proffessor.module';
import { SchoolModule } from './school/school.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
