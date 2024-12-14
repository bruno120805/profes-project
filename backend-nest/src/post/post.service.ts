import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { RatingEnum } from './enums/rating.enum';
import { Difficulty, Rating } from '@prisma/client';
import { DifficultyEnum } from './enums/difficulty.enum';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createPostDto: CreatePostDto,
    userId: string,
    professorId: string,
  ) {
    const professorExists = await this.prisma.proffessor.findUnique({
      where: { id: professorId },
    });

    if (!professorExists)
      throw new BadRequestException('Profesor no encontrado');

    const post = await this.prisma.$transaction(async (prisma) => {
      const school = await prisma.school.findFirst({
        where: { id: professorExists.schoolId },
      });

      // Mapea el RatingEnum a Prisma Rating
      const mapRatingEnumToPrisma = (rating: RatingEnum): Rating => {
        switch (rating) {
          case RatingEnum.Excellent:
            return Rating.Excellent;
          case RatingEnum.Good:
            return Rating.Good;
          case RatingEnum.Bad:
            return Rating.Bad;
        }
      };

      // Mapea el DifficultyEnum a Prisma Difficulty
      const mapDifficultyEnumToPrisma = (
        difficulty: DifficultyEnum,
      ): Difficulty => {
        switch (difficulty) {
          case DifficultyEnum.Easy:
            return Difficulty.Easy;
          case DifficultyEnum.Regular:
            return Difficulty.Regular;
          case DifficultyEnum.Hard:
            return Difficulty.Hard;
        }
      };

      const posts = await prisma.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          isAnonymous: createPostDto.isAnonymous || false,
          wouldRetake: createPostDto.wouldRetake,
          rating: mapRatingEnumToPrisma(createPostDto.rating),
          difficulty: mapDifficultyEnumToPrisma(createPostDto.difficulty),
          author: {
            connect: { id: userId },
          },
          school: {
            connect: { id: school.id },
          },
          proffessor: {
            connect: { id: professorId },
          },
        },
      });

      return posts;
    });

    return post;
  }

  async remove(id: string, userId: string) {
    try {
      const postExists = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!postExists) throw new BadRequestException('Post not found');

      const userPost = await this.prisma.post.findUnique({
        where: { id },
      });

      if (userId !== userPost.authorId)
        throw new BadRequestException("You can't delete this post");

      await this.prisma.post.delete({
        where: { id },
      });

      return 'Post deleted successfully';
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException(error.message);

      throw new InternalServerErrorException(error.message);
    }
  }
}
