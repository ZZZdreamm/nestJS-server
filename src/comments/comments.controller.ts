import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CommentCreateDto } from './dto/commentCreateDto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/all/:amount')
  @ApiParam({ name: 'amount' })
  getAll(@Param('amount') amount: string, @Query('postId') postId: string) {
    return this.commentsService.getSomeNewest(+amount, postId);
  }

  @Post('/create')
  create(@Body() commentCreateDto: CommentCreateDto) {
    return this.commentsService.create(commentCreateDto);
  }
}
