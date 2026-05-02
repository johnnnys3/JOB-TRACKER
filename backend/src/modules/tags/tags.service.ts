import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async create(createTagDto: CreateTagDto) {
    const name = createTagDto.name.trim();

    return this.prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

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
