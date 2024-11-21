import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CreateProffessorDto } from './dto/create-proffessor.dto';
import { UpdateProffessorDto } from './dto/update-proffessor.dto';
import { ProffessorService } from './proffessor.service';

@Controller('profesores')
export class ProffessorController {
  constructor(private readonly proffessorService: ProffessorService) {}

  @Post(':schoolId')
  create(
    @Body() createProffessorDto: CreateProffessorDto,
    @Param('schoolId') schoolId: string,
  ) {
    return this.proffessorService.create(createProffessorDto, schoolId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProffessorDto: UpdateProffessorDto,
  ) {
    return this.proffessorService.update(+id, updateProffessorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proffessorService.remove(+id);
  }
}
