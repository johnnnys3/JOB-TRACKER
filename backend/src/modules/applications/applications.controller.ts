import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    return this.applicationsService.create(createApplicationDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.applicationsService.findAll(req.user.id, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.applicationsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateApplicationDto: any,
    @Request() req
  ) {
    return this.applicationsService.update(id, updateApplicationDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.applicationsService.remove(id, req.user.id);
  }

  @Post(':id/tags/:tagId')
  addTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @Request() req
  ) {
    return this.applicationsService.addTag(id, tagId, req.user.id);
  }

  @Delete(':id/tags/:tagId')
  removeTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @Request() req
  ) {
    return this.applicationsService.removeTag(id, tagId, req.user.id);
  }
}
