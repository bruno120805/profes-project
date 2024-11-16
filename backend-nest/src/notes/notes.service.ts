import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/services/s3.service';
import { UpdateNoteDto } from './dto/update-note.dto';
import { v4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(
    private readonly s3: S3Service,
    private readonly prisma: PrismaService,
  ) {}

  async uploadFilesNotes(
    files: Array<Express.Multer.File>,
    createNoteDto: CreateNoteDto,
    userId: string,
    professorId: string,
  ) {
    const uploadedFiles = await Promise.all(
      files.map((file) => this.s3.upload(file, v4())),
    );

    try {
      const notes = await this.prisma.$transaction(async (prisma) => {
        return prisma.notes.create({
          data: {
            ...createNoteDto,
            filesUrls: uploadedFiles,
            user: {
              connect: { id: userId },
            },
            Proffessor: {
              connect: { id: professorId },
            },
          },
          include: {
            Proffessor: {
              select: {
                name: true,
              },
            },
          },
        });
      });
      return notes;
    } catch (error) {
      console.log(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: string) {
    return `This action removes a #${id} note`;
  }
}
