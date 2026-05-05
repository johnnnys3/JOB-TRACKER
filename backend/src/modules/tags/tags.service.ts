import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { PaginationOptions, toPaginatedResult } from '../../common/pagination';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, pagination: PaginationOptions) {
    const where = { userId };
    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),
      this.prisma.tag.count({ where }),
    ]);

    return toPaginatedResult(tags, total, pagination.page, pagination.limit);
  }

  async create(createTagDto: CreateTagDto, userId: string) {
    const name = createTagDto.name.trim();

    return this.prisma.tag.upsert({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
      update: {},
      create: { name, userId },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const tag = await this.prisma.tag.findFirst({ where: { id, userId } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return this.prisma.tag.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  }
}
