import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findByQuery(@Query('buscar') buscar: string, @Query('q') query: string) {
    return this.searchService.findManyProfessors(buscar, query);
  }

  @Get('profesores/:schoolId')
  findAllSchoolProfessors(
    @Param('schoolId', ParseUUIDPipe) schoolId: string,
    @Query('q') query: string,
  ) {
    return this.searchService.findAllSchoolProfessors(schoolId, query);
  }

  @Get('profesor/professorId')
  findOneProfessor(@Param('professorId', ParseUUIDPipe) professorId: string) {
    return this.searchService.findOneProfessor(professorId);
  }
}
