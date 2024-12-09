import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProffessorDto } from './dto/create-proffessor.dto';
import { UpdateProffessorDto } from './dto/update-proffessor.dto';

@Injectable()
export class ProffessorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProffessorDto: CreateProffessorDto, schoolId: string) {
    const proffessorData = await this.prisma.proffessor.create({
      data: {
        ...createProffessorDto,
        name: createProffessorDto.name.replaceAll(' ', '+'),
        school: {
          connect: {
            id: schoolId,
          },
        },
      },
    });

    return proffessorData;
  }

  update(id: number, updateProffessorDto: UpdateProffessorDto) {
    return `This action updates a #${id} proffessor`;
  }

  remove(id: number) {
    return `This action removes a #${id} proffessor`;
  }
}
