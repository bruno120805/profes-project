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
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolService } from './school.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Auth('admin')
  @Post()
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolService.create(createSchoolDto);
  }

  @Get(':schoolId')
  findOne(@Param('schoolId', ParseUUIDPipe) id: string) {
    return this.schoolService.findOne(id);
  }

  @Patch(':schoolId')
  update(
    @Param('schoolId') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolService.update(id, updateSchoolDto);
  }

  @Delete(':schoolId')
  remove(@Param('schoolId') id: string) {
    return this.schoolService.remove(id);
  }
}
