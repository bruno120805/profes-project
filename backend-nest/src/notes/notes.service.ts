import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/services/s3.service';
import { v4 } from 'uuid';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

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

  private readonly deleteFiles = async (filesUrls: string[]) => {
    for (const file of filesUrls) {
      const key = file.split('.')[0];
      const extension = file.split('.').pop();
      await this.s3.delete(key, extension);
    }
  };

  async remove(id: string) {
    // Find the note
    const notes = await this.prisma.notes.findUnique({
      where: { id },
    });

    if (!notes) throw new NotFoundException('Note not found');

    const filesUrls = notes.filesUrls.map((url) => url.split('/').pop());
    await this.deleteFiles(filesUrls);

    await this.prisma.notes.delete({
      where: { id },
    });

    return 'Note deleted successfully';
  }
}
