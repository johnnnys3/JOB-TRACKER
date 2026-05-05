import { NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

describe('ApplicationsService', () => {
  const prisma = {
    application: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    interview: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    applicationTag: {
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    tag: {
      findFirst: jest.fn(),
    },
  };

  let service: ApplicationsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ApplicationsService(prisma as any);
  });

  it('lists only applications owned by the authenticated user with pagination metadata', async () => {
    prisma.application.findMany.mockResolvedValue([
      {
        id: 'application-1',
        company: 'Acme',
        jobTitle: 'Engineer',
        tags: [{ tag: { name: 'remote' } }],
        interviews: [],
      },
    ]);
    prisma.application.count.mockResolvedValue(1);

    const result = await service.findAll('user-1', { page: 1, limit: 10, skip: 0 }, {
      search: 'engineer',
      status: 'APPLIED',
    });

    expect(prisma.application.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        userId: 'user-1',
        status: 'APPLIED',
        OR: [
          { company: { contains: 'engineer', mode: 'insensitive' } },
          { jobTitle: { contains: 'engineer', mode: 'insensitive' } },
        ],
      }),
      skip: 0,
      take: 10,
    }));
    expect(result).toEqual({
      data: [
        expect.objectContaining({
          id: 'application-1',
          tags: ['remote'],
        }),
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it('throws not found when an application is missing or owned by another user', async () => {
    prisma.application.findFirst.mockResolvedValue(null);

    await expect(service.findOne('application-1', 'user-1')).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.application.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'application-1', userId: 'user-1' },
    }));
  });

  it('verifies tag ownership before linking tags', async () => {
    prisma.application.findFirst.mockResolvedValue({
      id: 'application-1',
      company: 'Acme',
      jobTitle: 'Engineer',
      tags: [],
      interviews: [],
    });
    prisma.tag.findFirst.mockResolvedValue({ id: 'tag-1' });
    prisma.applicationTag.upsert.mockResolvedValue({});

    await service.addTag('application-1', 'tag-1', 'user-1');

    expect(prisma.tag.findFirst).toHaveBeenCalledWith({
      where: { id: 'tag-1', userId: 'user-1' },
      select: { id: true },
    });
    expect(prisma.applicationTag.upsert).toHaveBeenCalledWith({
      where: {
        applicationId_tagId: {
          applicationId: 'application-1',
          tagId: 'tag-1',
        },
      },
      update: {},
      create: {
        applicationId: 'application-1',
        tagId: 'tag-1',
      },
    });
  });
});
