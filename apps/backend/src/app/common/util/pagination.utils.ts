import { PaginationMeta } from '@app/shared-types';
import { Request } from 'express';

export const DEFAULT_PAGE_SIZE = 20;

export interface PaginationParams {
  page: number;
  pageSize: number;
  offset: number;
}

export function calculateLastPage(totalAmount: number, pageSize: number): number {
  return Math.ceil(totalAmount / pageSize);
}

export function buildPaginationParams(req: Request): PaginationParams {
  const page = req.query.page === undefined ? 1 : parseInt(req.query.page as string, 10);
  const pageSize =
    req.query['page-size'] === undefined ? DEFAULT_PAGE_SIZE : parseInt(req.query['page-size'] as string, 10);

  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
}

export function buildPaginationMeta(paginationParams: PaginationParams, totalAmount: number): PaginationMeta {
  return {
    total: totalAmount,
    perPage: paginationParams.pageSize,
    currentPage: paginationParams.page,
    lastPage: calculateLastPage(totalAmount, paginationParams.pageSize),
  };
}
