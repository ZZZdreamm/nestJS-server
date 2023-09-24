import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { createWebToken } from 'src/cacarrot/auth/jwtToken';
import { Public } from '../authentication/public.decorator';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Public()
  @Post('/register')
  @ApiOkResponse({
    description: 'Register profile',
    type: Profile,
  })
  @UsePipes(ValidationPipe)
  async register(@Body() createProfileDto: CreateProfileDto) {
    const user = await this.profilesService.create(createProfileDto);
    if (user.Id) {
      const token = createWebToken(createProfileDto);
      return { token: token, user: user };
    } else {
      return new Error('Invalid login or password');
    }
  }

  @Public()
  @Post('/login')
  @ApiOkResponse({
    description: 'Login profile',
    type: Profile,
  })
  async login(@Body() userCredentials: UserCredentials) {
    const user = await this.profilesService.login(userCredentials);
    if (user.Id) {
      const token = createWebToken(userCredentials);
      return { token: token, user: user };
    } else {
      return new Error('Invalid login or password');
    }
  }

  @Get('/one/:id')
  @ApiOkResponse({
    description: 'Get profile',
    type: ProfileDto,
  })
  @ApiParam({ name: 'id' })
  getProfile(@Param('id') id: string): Promise<ProfileDto> {
    return this.profilesService.getProfile(id);
  }

  @Get('/search/:query')
  @ApiOkResponse({
    description: 'Get profile by email query',
    type: ProfileDto,
  })
  @ApiParam({ name: 'query' })
  getAllProfilesByEmail(@Param('query') query: string): Promise<ProfileDto[]> {
    return this.profilesService.getAllProfilesByEmail(query);
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

  @Post('/sendFriendRequest')
  @ApiOkResponse({
    description: 'Send friend request',
    type: ProfileDto,
  })
  sendFriendRequest(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
  ) {
    return this.profilesService.sendFriendRequest(userId, friendId);
  }

  @Patch('/acceptFriendRequest')
  @ApiOkResponse({
    description: 'Accept friend request',
    type: ProfileDto,
  })
  acceptFriendRequest(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
  ) {
    return this.profilesService.acceptFriendRequest(userId, friendId);
  }

  @Get('/searchFriends/:userId')
  @ApiOkResponse({
    description: 'Search friends',
  })
  async searchFriends(
    @Param('userId') userId: string,
    @Query('query') query: string,
  ) {
    const friends = await this.profilesService.getFriends(userId);
    return this.profilesService.searchFriends(friends, query);
  }

  @Get('/ifInFriends')
  async ifInFriends(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
  ) {
    return this.profilesService.checkIfInFriends(userId, friendId);
  }

  @Get('/getFriends/:userId')
  @ApiOkResponse({
    description: 'Get friends',
  })
  getFriends(@Param('userId') userId: string) {
    return this.profilesService.getFriends(userId);
  }

  @Delete('/deleteFriend')
  @ApiOkResponse({
    description: 'Delete profile',
  })
  deleteFriend(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
  ) {
    return this.profilesService.removeFriend(userId, friendId);
  }

  @Delete('/removeFriendRequest')
  @ApiOkResponse({
    description: 'Remove friend request',
    type: ProfileDto,
  })
  removeFriendRequest(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
  ) {
    return this.profilesService.removeFriendRequest(userId, friendId);
  }

  @Delete('/deleteFriendRequest')
  @ApiOkResponse({
    description: 'Delete friend request',
  })
  deleteFriendRequest(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
  ) {
    return this.profilesService.removeFriendRequest(userId, friendId);
  }

  @Get('/getFriendRequests/:userId')
  @ApiOkResponse({
    description: 'Get friend requests',
  })
  @ApiParam({ name: 'userId' })
  getFriendsRequests(@Param('userId') userId: string) {
    return this.profilesService.getFriendsRequests(userId);
  }

  @Get('/getSentFriendRequests/:userId')
  @ApiOkResponse({
    description: 'Get sent friend requests',
  })
  @ApiParam({ name: 'userId' })
  getSentFriendRequests(@Param('userId') userId: string) {
    return this.profilesService.getSentFriendRequests(userId);
  }
}
