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
import { CreateProffessorDto } from './dto/create-proffessor.dto';
import { UpdateProffessorDto } from './dto/update-proffessor.dto';
import { ProffessorService } from './proffessor.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

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
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProffessorDto: UpdateProffessorDto,
  ) {
    return this.proffessorService.update(id, updateProffessorDto);
  }

  @Auth('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proffessorService.remove(id);
  }
}
