import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

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

    const { schoolName } = createPostDto;

    const post = await this.prisma.$transaction(async (prisma) => {
      let school = await prisma.school.findFirst({
        where: { name: schoolName.replaceAll(' ', '+').toLowerCase() },
      });

      if (!school) {
        school = await prisma.school.create({
          data: {
            name: schoolName.replaceAll(' ', '+').toLowerCase(),
          },
        });
      }

      const posts = await prisma.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          isAnonymous: createPostDto.isAnonymous || false,
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
