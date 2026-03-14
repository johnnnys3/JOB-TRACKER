import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string) {
    const [
      totalApplications,
      applicationsByStatus,
      totalInterviews,
      interviewsByStatus,
      recentApplications,
      upcomingInterviews,
    ] = await Promise.all([
      this.getTotalApplications(userId),
      this.getApplicationsByStatus(userId),
      this.getTotalInterviews(userId),
      this.getInterviewsByStatus(userId),
      this.getRecentApplications(userId, 5),
      this.getUpcomingInterviews(userId, 5),
    ]);

    return {
      totalApplications,
      applicationsByStatus,
      totalInterviews,
      interviewsByStatus,
      recentApplications,
      upcomingInterviews,
    };
  }

  async getTotalApplications(userId: string) {
    return this.prisma.application.count({
      where: { userId },
    });
  }

  async getApplicationsByStatus(userId: string) {
    const results = await this.prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        status: true,
      },
    });

    return results.map(result => ({
      status: result.status,
      count: result._count.status,
    }));
  }

  async getTotalInterviews(userId: string) {
    return this.prisma.interview.count({
      where: { userId },
    });
  }

  async getInterviewsByStatus(userId: string) {
    const results = await this.prisma.interview.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        status: true,
      },
    });

    return results.map(result => ({
      status: result.status,
      count: result._count.status,
    }));
  }

  async getRecentApplications(userId: string, limit: number) {
    return this.prisma.application.findMany({
      where: { userId },
      take: limit,
      orderBy: { applicationDate: 'desc' },
      select: {
        id: true,
        company: true,
        position: true,
        status: true,
        applicationDate: true,
      },
    });
  }

  async getUpcomingInterviews(userId: string, limit: number) {
    const now = new Date();
    return this.prisma.interview.findMany({
      where: { 
        userId,
        date: { gte: now },
        status: 'SCHEDULED',
      },
      take: limit,
      orderBy: { date: 'asc' },
      include: {
        application: {
          select: {
            id: true,
            company: true,
            position: true,
          },
        },
      },
    });
  }

  async getApplicationTrends(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const applications = await this.prisma.application.findMany({
      where: {
        userId,
        applicationDate: {
          gte: startDate,
        },
      },
      select: {
        applicationDate: true,
        status: true,
      },
      orderBy: { applicationDate: 'asc' },
    });

    // Group by date
    const trends = applications.reduce((acc, app) => {
      const date = app.applicationDate.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, total: 0, status: {} };
      }
      acc[date].total++;
      acc[date].status[app.status] = (acc[date].status[app.status] || 0) + 1;
      return acc;
    }, {});

    return Object.values(trends);
  }

  async getInterviewTrends(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const interviews = await this.prisma.interview.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      select: {
        date: true,
        status: true,
        type: true,
      },
      orderBy: { date: 'asc' },
    });

    // Group by date
    const trends = interviews.reduce((acc, interview) => {
      const date = interview.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, total: 0, status: {}, type: {} };
      }
      acc[date].total++;
      acc[date].status[interview.status] = (acc[date].status[interview.status] || 0) + 1;
      acc[date].type[interview.type] = (acc[date].type[interview.type] || 0) + 1;
      return acc;
    }, {});

    return Object.values(trends);
  }
}
