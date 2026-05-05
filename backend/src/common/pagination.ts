import { BadRequestException } from '@nestjs/common';

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function parsePositiveIntQuery(value: string | undefined, fallback: number, max?: number) {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new BadRequestException('Pagination values must be positive integers');
  }

  return max ? Math.min(parsed, max) : parsed;
}

export function getPaginationOptions(page?: string, limit?: string, defaultLimit = 10): PaginationOptions {
  const pageNumber = parsePositiveIntQuery(page, 1);
  const limitNumber = parsePositiveIntQuery(limit, defaultLimit, 100);

  return {
    page: pageNumber,
    limit: limitNumber,
    skip: (pageNumber - 1) * limitNumber,
  };
}

export function toPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
