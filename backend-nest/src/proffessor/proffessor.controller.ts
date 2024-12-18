import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateProffessorDto } from './dto/create-proffessor.dto';
import { UpdateProffessorDto } from './dto/update-proffessor.dto';
import { ProffessorService } from './proffessor.service';

@Controller('profesores')
export class ProffessorController {
  constructor(private readonly proffessorService: ProffessorService) {}

  @Auth('admin')
  @Post(':schoolId')
  create(
    @Body() createProffessorDto: CreateProffessorDto,
    @Param('schoolId', ParseUUIDPipe) schoolId: string,
  ) {
    return this.proffessorService.create(createProffessorDto, schoolId);
  }

  @Get(':professorId')
  findProfessorById(@Param('professorId', ParseUUIDPipe) professorId: string) {
    return this.proffessorService.findProfessorById(professorId);
  }

  @Auth('admin')
  @Patch(':professorId')
  update(
    @Param('professorId') id: string,
    @Body() updateProffessorDto: UpdateProffessorDto,
  ) {
    return this.proffessorService.update(id, updateProffessorDto);
  }

  @Auth('admin')
  @Delete(':professorId')
  remove(@Param('professorId') id: string) {
    return this.proffessorService.remove(id);
  }
}
