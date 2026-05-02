import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../common/types/authenticated-request';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  async create(@Body() createInterviewDto: CreateInterviewDto, @Request() req: AuthenticatedRequest) {
    return {
      data: await this.interviewsService.create(createInterviewDto, req.user.id),
      message: 'success',
    };
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    return {
      data: await this.interviewsService.findAll(req.user.id),
      message: 'success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return {
      data: await this.interviewsService.findOne(id, req.user.id),
      message: 'success',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateInterviewDto: UpdateInterviewDto,
    @Request() req: AuthenticatedRequest
  ) {
    return {
      data: await this.interviewsService.update(id, updateInterviewDto, req.user.id),
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return {
      data: await this.interviewsService.remove(id, req.user.id),
      message: 'success',
    };
  }

  @Get('application/:applicationId')
  async findByApplication(@Param('applicationId') applicationId: string, @Request() req: AuthenticatedRequest) {
    return {
      data: await this.interviewsService.findByApplication(applicationId, req.user.id),
      message: 'success',
    };
  }
}
