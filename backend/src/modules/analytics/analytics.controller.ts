import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary(@Request() req) {
    return this.analyticsService.getSummary(req.user.id);
  }

  @Get('trends/applications')
  getApplicationTrends(
    @Request() req,
    @Query('days') days?: string,
  ) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getApplicationTrends(req.user.id, daysNum);
  }

  @Get('trends/interviews')
  getInterviewTrends(
    @Request() req,
    @Query('days') days?: string,
  ) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getInterviewTrends(req.user.id, daysNum);
  }
}
