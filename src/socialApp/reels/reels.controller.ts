import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReelsService } from './reels.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReelsCreationDto } from './dto/reelsCreationDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReelsDto } from './dto/reelsDto';

@ApiTags('reels')
@Controller('reels')
export class ReelsController {
  constructor(private readonly reelsService: ReelsService) {}

  @Post('/create')
  @ApiOkResponse({
    description: 'Create reels',
    type: ReelsCreationDto,
  })
  @UseInterceptors(FileInterceptor('MediaFile'))
  async create(
    @Body() reelsCreationDto: ReelsCreationDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 100000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.reelsService.create(reelsCreationDto, file);
  }

  @Get('/getReels')
  @ApiOkResponse({
    description: 'Get reels',
    type: ReelsCreationDto,
  })
  async getReels(
    @Query('lastReelsDate') lastReelsDate: string,
    @Query('amount') amount: string,
  ) {
    return await this.reelsService.getMany(+lastReelsDate, +amount);
  }

  @Get('/getManyUsersReels')
  @ApiOkResponse({
    description: 'Get user reels',
    type: ReelsDto,
  })
  async getManyUsersReels(@Body() autorsIds: string[]) {
    return await this.reelsService.getManyAutorsReelsByIds(autorsIds);
  }

  @Get('/getUserReels')
  @ApiOkResponse({
    description: 'Get user reels',
    type: ReelsDto,
  })
  async getUserReels(@Query('autorId') autorId: string) {
    return await this.reelsService.getManyByAutorId(autorId);
  }

  @Get('/getReel/:id')
  @ApiOkResponse({
    description: 'Get reel',
    type: ReelsDto,
  })
  @ApiParam({ name: 'id' })
  async getReel(@Param('id') id: string) {
    return await this.reelsService.getOne(id);
  }
}
