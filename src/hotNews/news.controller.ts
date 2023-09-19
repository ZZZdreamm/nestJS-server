import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('/all')
  getAll(@Query('searchQuery') searchQuery: string) {
    return this.newsService.getAll(searchQuery);
  }
}
