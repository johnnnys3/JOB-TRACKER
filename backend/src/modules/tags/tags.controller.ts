import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../common/types/authenticated-request';
import { getPaginationOptions } from '../../common/pagination';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pagination = getPaginationOptions(page, limit, 100);

    return {
      data: await this.tagsService.findAll(req.user.id, pagination),
      message: 'success',
    };
  }

  @Post()
  async create(@Body() createTagDto: CreateTagDto, @Request() req: AuthenticatedRequest) {
    return {
      data: await this.tagsService.create(createTagDto, req.user.id),
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return {
      data: await this.tagsService.remove(id, req.user.id),
      message: 'success',
    };
  }
}
