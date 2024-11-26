import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesService } from './notes.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  //SUBE VARIOS ARCHIVOS

  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Throttle({ default: { ttl: 5000, limit: 1, blockDuration: 10000 } })
  @Post(':professorId/creates-note')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: {
        fileSize: 1024 * 1024 * 2, // 2MB
        files: 5,
      },
    }),
  )
  uploadFilesNotes(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createNoteDto: CreateNoteDto,
    @Param('professorId', ParseUUIDPipe) professorId: string,
    @Req() req: Request,
  ) {
    const userId = req.user['userId'];

    if (
      files.map((file) => file.size).reduce((a, b) => a + b, 0) >
      1024 * 1024 * 2
    )
      throw new BadRequestException('Files too large, max size 2MB');

    if (!files) throw new BadRequestException('No files uploaded');
    return this.notesService.uploadFilesNotes(
      files,
      createNoteDto,
      userId,
      professorId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':noteId')
  likeNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Req() req: Request,
  ) {
    const userId = req.user['userId'];

    return this.notesService.likeNote(noteId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':noteId')
  unlikeNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Req() req: Request,
  ) {
    const userId = req.user['userId'];

    return this.notesService.unlikeNote(noteId, userId);
  }

  @Get(':noteId')
  getNoteLikes(@Param('noteId', ParseUUIDPipe) noteId: string) {
    return this.notesService.getNoteLikes(noteId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
  //   return this.notesService.update(+id, updateNoteDto);
  // }

  @Delete(':noteId')
  remove(@Param('noteId', ParseUUIDPipe) id: string) {
    return this.notesService.remove(id);
  }
}
