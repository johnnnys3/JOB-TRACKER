import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplicationStatus } from '@prisma/client';

type TrendBucket = {
  date: string;
  total: number;
  status: Partial<Record<ApplicationStatus, number>>;
};

type InterviewTrendBucket = {
  date: string;
  total: number;
  stage: Record<string, number>;
};

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string) {
    const [
      totalApplications,
      applicationsByStatus,
      totalInterviews,
      interviewsByStage,
      recentApplications,
      upcomingInterviews,
      applicationTrends,
    ] = await Promise.all([
      this.getTotalApplications(userId),
      this.getApplicationsByStatus(userId),
      this.getTotalInterviews(userId),
      this.getInterviewsByStage(userId),
      this.getRecentApplications(userId, 5),
      this.getUpcomingInterviews(userId, 5),
      this.getApplicationTrends(userId),
    ]);
    const statusDistribution = applicationsByStatus.reduce(
      (acc, item) => ({
        ...acc,
        [item.status]: item.count,
      }),
      {} as Partial<Record<ApplicationStatus, number>>,
    );
    const interviewCount = statusDistribution.INTERVIEW || 0;
    const offerCount = statusDistribution.OFFER || 0;

    return {
      totalApplications,
      applicationsByStatus,
      totalInterviews,
      interviewsByStage,
      recentApplications,
      upcomingInterviews,
      statusDistribution,
      applicationTrends: applicationTrends.map(trend => ({
        date: trend.date,
        count: trend.total,
      })),
      interviewRate: totalApplications > 0 ? interviewCount / totalApplications : 0,
      offerRate: totalApplications > 0 ? offerCount / totalApplications : 0,
      activeApplications: (statusDistribution.APPLIED || 0) + interviewCount,
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

  async getInterviewsByStage(userId: string) {
    const results = await this.prisma.interview.groupBy({
      by: ['stage'],
      where: { userId },
      _count: {
        stage: true,
      },
    });

    return results.map(result => ({
      stage: result.stage,
      count: result._count.stage,
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
        jobTitle: true,
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
      },
      take: limit,
      orderBy: { date: 'asc' },
      include: {
        application: {
          select: {
            id: true,
            company: true,
            jobTitle: true,
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
    const trends = applications.reduce<Record<string, TrendBucket>>((acc, app) => {
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
        stage: true,
      },
      orderBy: { date: 'asc' },
    });

    // Group by date
    const trends = interviews.reduce<Record<string, InterviewTrendBucket>>((acc, interview) => {
      const date = interview.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, total: 0, stage: {} };
      }
      acc[date].total++;
      acc[date].stage[interview.stage] = (acc[date].stage[interview.stage] || 0) + 1;
      return acc;
    }, {});

    return Object.values(trends);
  }
}
