import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CommentCreateDto } from './dto/commentCreateDto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/all')
  @ApiParam({ name: 'lastCommentDate' })
  getAll(
    @Query('postId') postId: string,
    @Query('lastCommentDate') lastCommentDate: string,
    @Query('amount') amount: string,
  ) {
    return this.commentsService.getSomeNewest(
      postId,
      +lastCommentDate,
      +amount,
    );
  }

  @Post('/create')
  create(@Body() commentCreateDto: CommentCreateDto) {
    return this.commentsService.create(commentCreateDto);
  }
}
