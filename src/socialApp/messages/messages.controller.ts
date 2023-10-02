import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { MessageCreateDto } from './dto/messageCreateDto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('/send')
  @ApiOkResponse({
    description: 'Create message',
  })
  create(@Body() messageCreateDto: MessageCreateDto) {
    return this.messagesService.create(messageCreateDto);
  }

  @Get('/getMessage')
  @ApiOkResponse({
    description: 'Get one message',
  })
  getMessage(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
    @Query('messageId') messageId: string,
  ) {
    return this.messagesService.getMessage(userId, friendId, messageId);
  }

  @Get('/getChatMessages')
  @ApiOkResponse({
    description: 'Get messages',
  })
  getChatMessages(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
    @Query('lastMessageDate') lastMessageDate: string,
    @Query('amount') amount: string,
  ) {
    return this.messagesService.getChatMessages(
      userId,
      friendId,
      +lastMessageDate,
      +amount,
    );
  }

  @Get('/getMessagesToMessageWithId')
  @ApiOkResponse({
    description: 'Get messages',
  })
  getMessagesToMessageWithId(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
    @Query('messageId') messageId: string,
  ) {
    return this.messagesService.getAllMessagesToMessageWithId(
      userId,
      friendId,
      messageId,
    );
  }

  @Delete('/delete')
  @ApiOkResponse({
    description: 'Delete message',
  })
  deleteMessage(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
    @Query('messageId') messageId: string,
  ) {
    return this.messagesService.delete(userId, friendId, messageId);
  }

  @Get('/test')
  testEndpoint() {
    return 'Its test';
  }
}
