import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PostDto } from './dto/postDto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/all/:id')
  @ApiParam({ name: 'id' })
  getAll(@Param() params) {
    return this.postsService.getSomeNewest(+params.id);
  }
}
