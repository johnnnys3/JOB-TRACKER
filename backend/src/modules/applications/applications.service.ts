import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';

// Define UpdateApplicationDto inline to resolve import issue
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApplicationStatus, JobType } from '@prisma/client';

class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsDateString()
  applicationDate?: string;
}

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto, userId: string) {
    return this.prisma.application.create({
      data: {
        ...createApplicationDto,
        userId,
      },
      include: {
        tags: true,
        interviews: {
          orderBy: { date: 'desc' },
        },
      },
    });
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          tags: true,
          interviews: {
            orderBy: { date: 'desc' },
          },
        },
        orderBy: { applicationDate: 'desc' },
      }),
      this.prisma.application.count({
        where: { userId },
      }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const application = await this.prisma.application.findFirst({
      where: { id, userId },
      include: {
        tags: true,
        interviews: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto, userId: string) {
    const application = await this.findOne(id, userId);

    return this.prisma.application.update({
      where: { id },
      data: updateApplicationDto,
      include: {
        tags: true,
        interviews: {
          orderBy: { date: 'desc' },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const application = await this.findOne(id, userId);

    return this.prisma.application.delete({
      where: { id },
      select: {
        id: true,
        company: true,
        position: true,
      },
    });
  }

  
  
  async addInterview(applicationId: string, createInterviewDto: any, userId: string) {
    // Verify user owns the application
    await this.findOne(applicationId, userId);

    return this.prisma.interview.create({
      data: {
        ...createInterviewDto,
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
    const application = await this.findOne(applicationId, userId);

    return this.prisma.applicationTag.create({
      data: {
        applicationId,
        tagId,
      },
      include: {
        tag: true,
        application: {
          include: {
            tags: true,
          },
        },
      },
    });
  }

  async removeTag(applicationId: string, tagId: string, userId: string) {
    const application = await this.findOne(applicationId, userId);

    return this.prisma.applicationTag.delete({
      where: {
        applicationId_tagId: {
          applicationId,
          tagId,
        },
      },
    });
  }
}
