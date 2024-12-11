import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':professorId')
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
    @Param('professorId', ParseUUIDPipe) professorId: string,
  ) {
    const userId = req.user['userId'];
    return await this.postService.create(createPostDto, userId, professorId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':professorId')
  remove(@Param('professorId', ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = req.user['userId'];
    return this.postService.remove(id, userId);
  }
}
