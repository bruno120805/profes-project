import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/services/s3.service';
import { v4 } from 'uuid';
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

    const professor = await this.prisma.proffessor.findUnique({
      where: { id: professorId },
    });

    if (!professor) throw new NotFoundException('Profesor no encontrado');

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
              connect: { id: professor.id },
            },
            likesCounter: 0,
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

  async likeNote(noteId: string, userId: string) {
    const note = await this.prisma.notes.findUnique({
      where: { id: noteId },
    });

    if (!note) throw new NotFoundException('Note not found');

    const existingLike = await this.prisma.likes.findUnique({
      where: {
        userId_noteId: { userId, noteId },
      },
    });

    if (existingLike) {
      throw new ConflictException('You already liked this post');
    }

    // crear el like

    const like = await this.prisma.likes.create({
      data: {
        userId,
        noteId,
      },
    });

    await this.prisma.notes.update({
      where: { id: noteId },
      data: {
        likesCounter: {
          increment: 1,
        },
      },
    });

    return like;
  }

  async unlikeNote(noteId: string, userId: string) {
    const like = await this.prisma.likes.findUnique({
      where: {
        userId_noteId: { userId, noteId },
      },
    });

    const note = await this.prisma.notes.findUnique({
      where: { id: noteId },
    });

    //TODO: CHECK IT, IT MAY BE A BUG
    if (!like) {
      // Si no existe el like, lanzar una excepción
      throw new ConflictException(
        'You cannot dislike a note that you have not liked',
      );
    }

    await this.prisma.likes.delete({
      where: {
        userId_noteId: { userId, noteId },
      },
    });

    if (note.likesCounter === 0) return;

    await this.prisma.notes.update({
      where: {
        id: noteId,
      },
      data: {
        likesCounter: {
          decrement: 1,
        },
      },
    });
  }

  async getNoteLikes(noteId: string) {
    return this.prisma.notes.findUnique({
      where: { id: noteId },
      select: {
        likesCounter: true,
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} note`;
  // }

  // update(id: number, updateNoteDto: UpdateNoteDto) {
  //   return `This action updates a #${id} note`;
  // }

  private readonly deleteFiles = async (filesUrls: string[]) => {
    for (const file of filesUrls) {
      const key = file.split('.')[0];
      const extension = file.split('.').pop();
      await this.s3.delete(key, extension);
    }
  };

  async remove(noteId: string, userId: string) {
    // checar si el usuario es el dueño de la nota
    const isOwner = await this.prisma.notes.findFirst({
      where: { id: noteId },
    });

    if (isOwner.userId !== userId)
      throw new ConflictException('You are not the owner of this note');

    // Find the note
    const notes = await this.prisma.notes.findUnique({
      where: { id: noteId },
    });

    if (!notes) throw new NotFoundException('Note not found');

    const filesUrls = notes.filesUrls.map((url) => url.split('/').pop());
    await this.deleteFiles(filesUrls);

    await this.prisma.notes.delete({
      where: { id: noteId },
    });

    return 'Note deleted successfully';
  }
}
