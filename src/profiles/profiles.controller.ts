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
import { query } from 'express';

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

  @Post('/acceptFriendRequest')
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

  @Patch('/acceptFriendRequest')
  @ApiOkResponse({
    description: 'Accept friend request',
    type: ProfileDto,
  })
  removeFriendRequest(
    @Query('userId') userId: string,
    @Query('friendId') friendId: string,
  ) {
    return this.profilesService.acceptFriendRequest(userId, friendId);
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
  getFriendRequests(@Param('userId') userId: string) {
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
