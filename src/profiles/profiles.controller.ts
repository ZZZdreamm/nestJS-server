import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/createProfileDto';
import { Profile } from './entities/profile.entity';
import { UserCredentials } from './dto/userCredentials';
import { ProfileDto } from './dto/profileDto';
import { UpdateProfileDto } from './dto/updateProfileDto';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':id')
  @ApiOkResponse({
    description: 'Get profile',
    type: ProfileDto,
  })
  @ApiParam({ name: 'id' })
  getProfile(@Param('id') id: string): Promise<ProfileDto> {
    return this.profilesService.getProfile(id);
  }

  @Get('/email/:query')
  @ApiOkResponse({
    description: 'Get profile by email query',
    type: ProfileDto,
  })
  @ApiParam({ name: 'query' })
  getAllProfilesByEmail(@Param('query') query: string): Promise<ProfileDto[]> {
    return this.profilesService.getAllProfilesByEmail(query);
  }

  @Post('/register')
  @ApiOkResponse({
    description: 'Register profile',
    type: Profile,
  })
  @UsePipes(ValidationPipe)
  register(@Body() createProfileDto: CreateProfileDto): Promise<ProfileDto> {
    return this.profilesService.create(createProfileDto);
  }

  @Post('/update')
  @ApiOkResponse({
    description: 'Profile',
    type: UpdateProfileDto,
  })
  @UsePipes(ValidationPipe)
  updateProfile(@Body() profileDto: UpdateProfileDto) {
    return this.profilesService.update(profileDto);
  }

  @Post('/login')
  @ApiOkResponse({
    description: 'Login profile',
    type: Profile,
  })
  login(@Body() userCredentials: UserCredentials): Promise<ProfileDto> {
    console.log(userCredentials);
    return this.profilesService.login(userCredentials);
  }
}
