import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}
  async findAllSchoolProfessors(
    schoolId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) throw new NotFoundException('Escuela no encontrada');

    // calcular profesores total en la escuela
    const totalProfessors = await this.prisma.proffessor.count({
      where: {
        schoolId: school.id,
      },
    });

    const lastPage = Math.ceil(totalProfessors / limit);

    const profesores = await this.prisma.proffessor.findMany({
      where: {
        schoolId: school.id,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: profesores,
      page,
      limit,
      lastPage,
    };
  }

  async findOneProfessor(professorId: string) {
    const professor = await this.prisma.proffessor.findUnique({
      where: { id: professorId },
      select: {
        name: true,
        subject: true,
        school: {
          select: {
            name: true,
          },
        },
        posts: {
          select: {
            title: true,
            content: true,
          },
        },
      },
    });

    return professor;
  }

  async findManyProfessors(buscar: string, query: string) {
    try {
      if (buscar === 'Profesores') {
        const professors = await this.prisma.proffessor.findMany({
          where: {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          select: {
            name: true,
            subject: true,
            school: {
              select: {
                name: true,
              },
            },
            posts: {
              select: {
                title: true,
                content: true,
              },
            },
          },
        });

        if (!professors.length)
          throw new NotFoundException('No se encontraron profesores');

        return professors;
      }
      if (buscar === 'Escuelas') {
        const schools = await this.prisma.school.findMany({
          where: {
            name: {
              contains: query,
              mode: 'insensitive',
              startsWith: query,
            },
          },
          select: {
            name: true,
          },
        });

        if (!schools.length)
          throw new NotFoundException('No se encontraron escuelas');

        return schools;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error('Error al buscar ');
      }
    }
  }
}
