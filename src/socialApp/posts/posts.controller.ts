import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { PostDto } from './dto/postDto';
import { PostCreateDto } from './dto/postCreateDto';
import { UpdatePostDto } from './dto/updatePostDto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/all/:previousPostId')
  @ApiParam({ name: 'previousPostId' })
  getAll(@Param('previousPostId') previousPostId: string) {
    return this.postsService.getSomeNewest(+previousPostId);
  }

  @Post('/create')
  @ApiOkResponse({
    description: 'Create post',
    type: PostDto,
  })
  create(@Body() post: PostCreateDto) {
    return this.postsService.create(post);
  }

  @Patch('/like')
  @ApiOkResponse({
    description: 'Like post',
  })
  likePost(@Query('postId') postId: string, @Query('userId') userId: string) {
    return this.postsService.likePost(postId, userId);
  }

  @Patch('/removeLike')
  @ApiOkResponse({
    description: 'Remove like from post',
  })
  removeLikePost(
    @Query('postId') postId: string,
    @Query('userId') userId: string,
  ) {
    return this.postsService.removeLike(postId, userId);
  }

  @Get('/ifUserLiked')
  @ApiOkResponse({
    description: 'Check if post is liked',
  })
  ifLiked(@Query('postId') postId: string, @Query('userId') userId: string) {
    return this.postsService.ifUserLiked(postId, userId);
  }

  @Get('/userPosts/:username')
  @ApiParam({ name: 'username' })
  @ApiOkResponse({
    description: 'Get user posts',
  })
  getUserPosts(
    @Param('username') username: string,
    @Query('amount') amount: string,
  ) {
    return this.postsService.getPostsOfUser(username, +amount);
  }

  @Delete('/delete')
  @ApiOkResponse({
    description: 'Delete post',
  })
  deletePost(@Query('postId') postId: string) {
    return this.postsService.deletePost(postId);
  }

  @Patch('/update')
  @ApiOkResponse({
    description: 'Update post',
  })
  updatePost(@Body() post: UpdatePostDto) {
    return this.postsService.updatePost(post);
  }
}
