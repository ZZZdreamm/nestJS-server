import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserCredentials } from './dto/userCredentials';
import { createWebToken } from '../auth/jwtToken';

@ApiTags('cacarrot/users')
@Controller('cacarrot/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
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
