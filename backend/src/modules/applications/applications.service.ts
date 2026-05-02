import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CreateInterviewDto } from '../interviews/dto/create-interview.dto';
import { Prisma } from '@prisma/client';

const applicationInclude = {
  tags: {
    include: {
      tag: true,
    },
  },
  interviews: {
    orderBy: { date: 'desc' as const },
  },
} satisfies Prisma.ApplicationInclude;

type ApplicationWithRelations = Prisma.ApplicationGetPayload<{
  include: typeof applicationInclude;
}>;

export interface ApplicationFilters {
  status?: string;
  company?: string;
  search?: string;
  dateApplied?: string;
}

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  private formatApplication(application: ApplicationWithRelations) {
    return {
      ...application,
      tags: application.tags.map(applicationTag => applicationTag.tag.name),
    };
  }

  async create(createApplicationDto: CreateApplicationDto, userId: string) {
    const application = await this.prisma.application.create({
      data: {
        ...createApplicationDto,
        userId,
      },
      include: applicationInclude,
    });

    return this.formatApplication(application);
  }

  async findAll(userId: string, page = 1, limit = 10, filters: ApplicationFilters = {}) {
    const skip = (page - 1) * limit;
    const where: Prisma.ApplicationWhereInput = { userId };

    if (filters.status) {
      where.status = filters.status as Prisma.EnumApplicationStatusFilter['equals'];
    }

    if (filters.company) {
      where.company = { contains: filters.company, mode: 'insensitive' };
    }

    if (filters.search) {
      where.OR = [
        { company: { contains: filters.search, mode: 'insensitive' } },
        { jobTitle: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.dateApplied) {
      const start = new Date(filters.dateApplied);
      const end = new Date(filters.dateApplied);
      end.setDate(end.getDate() + 1);

      where.applicationDate = {
        gte: start,
        lt: end,
      };
    }
    
    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        include: applicationInclude,
        orderBy: { applicationDate: 'desc' },
      }),
      this.prisma.application.count({
        where,
      }),
    ]);

    return {
      data: applications.map(application => this.formatApplication(application)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const application = await this.prisma.application.findFirst({
      where: { id, userId },
      include: applicationInclude,
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.formatApplication(application);
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto, userId: string) {
    const application = await this.findOne(id, userId);

    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data: updateApplicationDto,
      include: applicationInclude,
    });

    return this.formatApplication(updatedApplication);
  }

  async remove(id: string, userId: string) {
    const application = await this.findOne(id, userId);

    return this.prisma.application.delete({
      where: { id },
      select: {
        id: true,
        company: true,
        jobTitle: true,
      },
    });
  }

  
  
  async addInterview(applicationId: string, createInterviewDto: CreateInterviewDto, userId: string) {
    // Verify user owns the application
    await this.findOne(applicationId, userId);

    return this.prisma.interview.create({
      data: {
        stage: createInterviewDto.stage,
        date: createInterviewDto.date,
        notes: createInterviewDto.notes,
        applicationId,
        userId,
      },
      include: {
        application: true,
      },
    });
  }

  async getInterviews(applicationId: string, userId: string) {
    // Verify user owns application
    await this.findOne(applicationId, userId);

    return this.prisma.interview.findMany({
      where: {
        applicationId,
      },
      include: {
        application: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async addTag(applicationId: string, tagId: string, userId: string) {
    await this.findOne(applicationId, userId);

    await this.prisma.applicationTag.upsert({
      where: {
        applicationId_tagId: {
          applicationId,
          tagId,
        },
      },
      update: {},
      create: {
        applicationId,
        tagId,
      },
    });

    return this.findOne(applicationId, userId);
  }

  async removeTag(applicationId: string, tagId: string, userId: string) {
    await this.findOne(applicationId, userId);

    await this.prisma.applicationTag.delete({
      where: {
        applicationId_tagId: {
          applicationId,
          tagId,
        },
      },
    });

    return this.findOne(applicationId, userId);
  }
}
