import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { PaginationOptions, toPaginatedResult } from '../../common/pagination';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  private async verifyApplicationOwnership(applicationId: string, userId: string) {
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
      select: { id: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }
  }

  async create(createInterviewDto: CreateInterviewDto, userId: string) {
    if (!createInterviewDto.applicationId) {
      throw new BadRequestException('Application is required');
    }

    await this.verifyApplicationOwnership(createInterviewDto.applicationId, userId);

    return this.prisma.interview.create({
      data: {
        stage: createInterviewDto.stage,
        date: createInterviewDto.date,
        notes: createInterviewDto.notes,
        applicationId: createInterviewDto.applicationId,
        userId,
      },
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

  async findAll(userId: string, pagination: PaginationOptions, applicationId?: string) {
    const where = {
      userId,
      ...(applicationId && { applicationId }),
    };

    const [interviews, total] = await Promise.all([
      this.prisma.interview.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          application: {
            select: {
              id: true,
              company: true,
              jobTitle: true,
            },
          },
        },
        orderBy: { date: 'asc' },
      }),
      this.prisma.interview.count({ where }),
    ]);

    return toPaginatedResult(interviews, total, pagination.page, pagination.limit);
  }

  async findOne(id: string, userId: string) {
    const interview = await this.prisma.interview.findFirst({
      where: { id, userId },
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

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return interview;
  }

  async update(id: string, updateInterviewDto: UpdateInterviewDto, userId: string) {
    const interview = await this.findOne(id, userId);

    return this.prisma.interview.update({
      where: { id },
      data: updateInterviewDto,
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

  async remove(id: string, userId: string) {
    const interview = await this.findOne(id, userId);

    return this.prisma.interview.delete({
      where: { id },
      select: {
        id: true,
        stage: true,
        date: true,
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

  async findByApplication(applicationId: string, userId: string, pagination: PaginationOptions) {
    await this.verifyApplicationOwnership(applicationId, userId);

    return this.findAll(userId, pagination, applicationId);
  }
}
