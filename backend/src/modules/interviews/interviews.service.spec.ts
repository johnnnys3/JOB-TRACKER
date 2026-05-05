import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InterviewsService } from './interviews.service';

describe('InterviewsService', () => {
  const prisma = {
    application: {
      findFirst: jest.fn(),
    },
    interview: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  let service: InterviewsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InterviewsService(prisma as any);
  });

  it('rejects creating an interview without an application id', async () => {
    await expect(
      service.create({
        stage: 'Recruiter call',
        date: '2026-05-10T10:00:00.000Z',
      }, 'user-1'),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.application.findFirst).not.toHaveBeenCalled();
    expect(prisma.interview.create).not.toHaveBeenCalled();
  });

  it('rejects creating an interview for an application owned by another user', async () => {
    prisma.application.findFirst.mockResolvedValue(null);

    await expect(
      service.create({
        applicationId: 'application-1',
        stage: 'Technical',
        date: '2026-05-11T10:00:00.000Z',
      }, 'user-1'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.application.findFirst).toHaveBeenCalledWith({
      where: { id: 'application-1', userId: 'user-1' },
      select: { id: true },
    });
    expect(prisma.interview.create).not.toHaveBeenCalled();
  });

  it('creates an interview only after confirming application ownership', async () => {
    const createdInterview = {
      id: 'interview-1',
      applicationId: 'application-1',
      userId: 'user-1',
      stage: 'Final',
      date: '2026-05-12T10:00:00.000Z',
      notes: 'Meet the team',
    };
    prisma.application.findFirst.mockResolvedValue({ id: 'application-1' });
    prisma.interview.create.mockResolvedValue(createdInterview);

    const result = await service.create({
      applicationId: 'application-1',
      stage: 'Final',
      date: '2026-05-12T10:00:00.000Z',
      notes: 'Meet the team',
    }, 'user-1');

    expect(prisma.interview.create).toHaveBeenCalledWith({
      data: {
        stage: 'Final',
        date: '2026-05-12T10:00:00.000Z',
        notes: 'Meet the team',
        applicationId: 'application-1',
        userId: 'user-1',
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
    expect(result).toEqual(createdInterview);
  });

  it('returns not found instead of a plain error for missing interviews', async () => {
    prisma.interview.findFirst.mockResolvedValue(null);

    await expect(service.findOne('interview-1', 'user-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('verifies application ownership before listing interviews by application', async () => {
    prisma.application.findFirst.mockResolvedValue({ id: 'application-1' });
    prisma.interview.findMany.mockResolvedValue([]);
    prisma.interview.count.mockResolvedValue(0);

    await service.findByApplication('application-1', 'user-1', {
      page: 1,
      limit: 25,
      skip: 0,
    });

    expect(prisma.application.findFirst).toHaveBeenCalledWith({
      where: { id: 'application-1', userId: 'user-1' },
      select: { id: true },
    });
    expect(prisma.interview.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        applicationId: 'application-1',
      },
      skip: 0,
      take: 25,
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
    });
    expect(prisma.interview.count).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        applicationId: 'application-1',
      },
    });
  });
});
