import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query'> implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  private readonly slowQueryThresholdMs = Number(process.env.SLOW_QUERY_THRESHOLD_MS || 250);

  constructor() {
    super({
      log: [{ emit: 'event', level: 'query' }],
    });

    this.$on('query', (event) => {
      if (event.duration >= this.slowQueryThresholdMs) {
        this.logger.warn(`Slow query ${event.duration}ms: ${event.query}`);
      }
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
