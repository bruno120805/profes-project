import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { S3Service } from 'src/services/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 2000,
        limit: 3,
      },
    ]),
  ],
  controllers: [NotesController],
  providers: [NotesService, S3Service, PrismaService],
})
export class NotesModule {}
