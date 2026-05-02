import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll() {
    return {
      data: await this.tagsService.findAll(),
      message: 'success',
    };
  }

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    return {
      data: await this.tagsService.create(createTagDto),
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      data: await this.tagsService.remove(id),
      message: 'success',
    };
  }
}
