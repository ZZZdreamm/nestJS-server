import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../authorization/roles.decorator';
import { Role } from '../authorization/roles.enum';
import { ProfileDto } from '../profiles/dto/profileDto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles(Role.Admin)
  hello() {
    return 'sd';
  }

  @Post('/moderator')
  @Roles(Role.Admin)
  async giveModeratorPermissions(@Query('userId') userId: string) {
    try {
      await this.adminService.addModeratorPermissions(userId);
      return { status: 200 };
    } catch (error) {
      return { status: 500 };
    }
  }
}
