/* eslint-disable @typescript-eslint/no-magic-numbers */
import { buildPaginationMeta, buildPaginationParams, calculateLastPage, DEFAULT_PAGE_SIZE } from './pagination.utils';
import { createMockRequest } from './test-utils';

describe('Pagination utils', () => {
  describe('calculateLastPage', () => {
    it('should calculate last page correctly', () => {
      const totalAmount = 100;
      const pageSize = 20;

      const result = calculateLastPage(totalAmount, pageSize);

      expect(result).toBe(5);
    });

    it('should calculate last page correctly when total amount is not divisible by page size', () => {
      const totalAmount = 105;
      const pageSize = 20;

      const result = calculateLastPage(totalAmount, pageSize);

      expect(result).toBe(6);
    });
  });

  describe('buildPaginationParams', () => {
    it('should return page and page size from query', () => {
      const req = createMockRequest({ query: { page: '2', 'page-size': '10' } });

      const result = buildPaginationParams(req);

      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(10);
    });

    it('should return default page if not defined', () => {
      const req = createMockRequest({ query: { 'page-size': '10' } });

      const result = buildPaginationParams(req);

      expect(result.page).toBe(1);
    });

    it('should return default page size if not defined', () => {
      const req = createMockRequest({ query: { page: '1' } });

      const result = buildPaginationParams(req);

      expect(result.pageSize).toBe(DEFAULT_PAGE_SIZE);
    });

    it('should return offset based on page and page size', () => {
      const req = createMockRequest({ query: { page: '2', 'page-size': '10' } });

      const result = buildPaginationParams(req);

      expect(result.offset).toBe(10);
    });
  });

  describe('buildPaginationMeta', () => {
    it('should build pagination meta correctly', () => {
      const paginationParams = { page: 2, pageSize: 10, offset: 10 };
      const totalAmount = 100;

      const result = buildPaginationMeta(paginationParams, totalAmount);

      expect(result.total).toBe(totalAmount);
      expect(result.perPage).toBe(10);
      expect(result.currentPage).toBe(2);
      expect(result.lastPage).toBe(10);
    });
  });
});
