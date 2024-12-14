import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProffessorDto } from './dto/create-proffessor.dto';
import { UpdateProffessorDto } from './dto/update-proffessor.dto';
import { SchoolService } from 'src/school/school.service';

@Injectable()
export class ProffessorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schoolService: SchoolService,
  ) {}

  async create(createProffessorDto: CreateProffessorDto, schoolId: string) {
    // Normalizar el nombre del profesor
    await this.schoolService.findOne(schoolId);

    const normalizedName = createProffessorDto.name.toLowerCase();

    // Buscar si ya existe un profesor con ese nombre y en esa escuela
    const professorExists = await this.prisma.proffessor.findFirst({
      where: {
        name: normalizedName,
        schoolId: schoolId,
      },
    });

    // Si el profesor ya existe, lanzar excepción
    if (professorExists) {
      throw new BadRequestException('El profesor ya existe en esta escuela');
    }

    // Crear el registro del profesor
    const proffessorData = await this.prisma.proffessor.create({
      data: {
        ...createProffessorDto,
        name: normalizedName,
        school: {
          connect: {
            id: schoolId,
          },
        },
      },
    });

    return proffessorData;
  }

  async findProfessorById(professorId: string) {
    const professor = await this.prisma.proffessor.findUnique({
      where: { id: professorId },
      select: {
        name: true,
        posts: {
          select: {
            title: true,
            content: true,
            school: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return professor;
  }

  async update(id: string, updateProffessorDto: UpdateProffessorDto) {
    await this.prisma.proffessor.update({
      where: { id },
      data: updateProffessorDto,
    });
  }

  async remove(id: string) {
    await this.prisma.proffessor.delete({
      where: { id },
    });
  }
}
