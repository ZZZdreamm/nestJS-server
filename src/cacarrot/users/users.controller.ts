import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserCredentials } from './dto/userCredentials';
import { createWebToken } from '../auth/jwtToken';

@ApiTags('cacarrot')
@Controller('cacarrot')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  @ApiOkResponse({
    description: 'Login',
    type: UserCredentials,
  })
  @UsePipes(ValidationPipe)
  async login(@Body() userCredentials: UserCredentials) {
    const user = await this.usersService.login(userCredentials);
    if (user.Id) {
      const token = createWebToken(userCredentials);
      return { token: token, user: user };
    } else {
      return new Error('Invalid login or password');
    }
  }

  @Post('/register')
  @ApiOkResponse({
    description: 'Register',
    type: UserCredentials,
  })
  @UsePipes(ValidationPipe)
  async register(@Body() userCredentials: UserCredentials) {
    const user = await this.usersService.register(userCredentials);
    if (user.Id) {
      const token = createWebToken(userCredentials);
      return { token: token, user: user };
    } else {
      return new Error('Invalid login or password');
    }
  }
}
