import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../common/types/authenticated-request';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req: AuthenticatedRequest) {
    return {
      data: await this.usersService.findOne(req.user.id),
      message: 'success',
    };
  }

  @Patch('me')
  async updateMe(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return {
      data: await this.usersService.updateProfile(req.user.id, updateProfileDto),
      message: 'success',
    };
  }
}
