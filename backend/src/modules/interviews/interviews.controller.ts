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

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  create(@Body() createInterviewDto: CreateInterviewDto, @Request() req) {
    return this.interviewsService.create(createInterviewDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.interviewsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.interviewsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateInterviewDto: UpdateInterviewDto,
    @Request() req
  ) {
    return this.interviewsService.update(id, updateInterviewDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.interviewsService.remove(id, req.user.id);
  }

  @Get('application/:applicationId')
  findByApplication(@Param('applicationId') applicationId: string, @Request() req) {
    return this.interviewsService.findByApplication(applicationId, req.user.id);
  }
}
