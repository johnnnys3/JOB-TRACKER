import {
  BadRequestException,
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
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CreateInterviewDto } from '../interviews/dto/create-interview.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../common/types/authenticated-request';
import { ApplicationStatus } from '@prisma/client';
import { getPaginationOptions } from '../../common/pagination';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto, @Request() req: AuthenticatedRequest) {
    return {
      data: await this.applicationsService.create(createApplicationDto, req.user.id),
      message: 'success',
    };
  }

  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('company') company?: string,
    @Query('search') search?: string,
    @Query('dateApplied') dateApplied?: string,
  ) {
    const pagination = getPaginationOptions(page, limit);
    const statusFilter = status && Object.values(ApplicationStatus).includes(status as ApplicationStatus)
      ? status
      : undefined;

    if (dateApplied && Number.isNaN(Date.parse(dateApplied))) {
      throw new BadRequestException('dateApplied must be a valid date');
    }

    return {
      data: await this.applicationsService.findAll(req.user.id, pagination, {
        status: statusFilter,
        company,
        search,
        dateApplied,
      }),
      message: 'success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return {
      data: await this.applicationsService.findOne(id, req.user.id),
      message: 'success',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Request() req: AuthenticatedRequest
  ) {
    return {
      data: await this.applicationsService.update(id, updateApplicationDto, req.user.id),
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return {
      data: await this.applicationsService.remove(id, req.user.id),
      message: 'success',
    };
  }

  // Interview endpoints as per PRD specification
  @Post(':id/interviews')
  async addInterview(
    @Param('id') id: string,
    @Body() createInterviewDto: CreateInterviewDto,
    @Request() req: AuthenticatedRequest
  ) {
    return {
      data: await this.applicationsService.addInterview(id, createInterviewDto, req.user.id),
      message: 'success',
    };
  }

  @Get(':id/interviews')
  async getInterviews(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pagination = getPaginationOptions(page, limit, 25);

    return {
      data: await this.applicationsService.getInterviews(id, req.user.id, pagination),
      message: 'success',
    };
  }

  @Post(':id/tags/:tagId')
  async addTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @Request() req: AuthenticatedRequest
  ) {
    return {
      data: await this.applicationsService.addTag(id, tagId, req.user.id),
      message: 'success',
    };
  }

  @Delete(':id/tags/:tagId')
  async removeTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @Request() req: AuthenticatedRequest
  ) {
    return {
      data: await this.applicationsService.removeTag(id, tagId, req.user.id),
      message: 'success',
    };
  }
}
