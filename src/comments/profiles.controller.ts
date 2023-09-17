import { Controller, Get, Post } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  getHello(): string {
    return this.profilesService.getHello();
  }
}
