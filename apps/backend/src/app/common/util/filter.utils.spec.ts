import { FILTER_TYPES } from '@app/shared-types';
import { buildFilterParams, isComplexFilter, isSimpleFilter } from './filter.utils';
import { createMockRequest } from './test-utils';

describe('Filter utils', () => {
  describe('isSimpleFilter', () => {
    it('should return true if filter is a string', () => {
      const filter = 'filter';

      const result = isSimpleFilter(filter);

      expect(result).toBe(true);
    });

    it('should return false if filter is an object', () => {
      const filter = {};

      const result = isSimpleFilter(filter);

      expect(result).toBe(false);
    });
  });

  describe('isComplexFilter', () => {
    it('should return false if filter is null', () => {
      const result = isComplexFilter(null);

      expect(result).toBe(false);
    });

    it('should return false if filter is not an object', () => {
      const result = isComplexFilter('filter');

      expect(result).toBe(false);
    });

    it('should return false if filter is an empty object', () => {
      const result = isComplexFilter({});

      expect(result).toBe(false);
    });

    it('should return false if filter is an object with more than one key', () => {
      const result = isComplexFilter({ [FILTER_TYPES.LIKE]: 'value1', [FILTER_TYPES.EQUAL]: 'value2' });

      expect(result).toBe(false);
    });

    it('should return false if filter type is not supported', () => {
      const result = isComplexFilter({ notAFilterType: 'value' });

      expect(result).toBe(false);
    });

    it('should return true if filter is a valid complex filter', () => {
      const result = isComplexFilter({ [FILTER_TYPES.LIKE]: 'value' });

      expect(result).toBe(true);
    });
  });

  describe('buildFilterParams', () => {
    it('should return an empty array if filters are not defined', () => {
      const req = createMockRequest({ query: { page: '1' } });

      const result = buildFilterParams(req);

      expect(result).toEqual([]);
    });

    it('should return an empty array if filters are not an object', () => {
      const req = createMockRequest({ query: { filter: 'filter' } });

      const result = buildFilterParams(req);

      expect(result).toEqual([]);
    });

    it('should not return filters that are not allowed', () => {
      const req = createMockRequest({ query: { filter: { notAllowedFilter: 'value' } } });

      const result = buildFilterParams(req, ['allowedFilter']);

      expect(result).toEqual([]);
    });

    it('should return filters that are allowed', () => {
      const req = createMockRequest({ query: { filter: { allowedFilter: 'value' } } });

      const result = buildFilterParams(req, ['allowedFilter']);

      expect(result).toEqual([{ property: 'allowedFilter', type: FILTER_TYPES.EQUAL, value: 'value' }]);
    });

    it('should return all filters if no allowed properties are defined', () => {
      const req = createMockRequest({
        query: { filter: { filter1: 'value1', filter2: { [FILTER_TYPES.LIKE]: 'value2' } } },
      });

      const result = buildFilterParams(req);

      expect(result).toEqual([
        { property: 'filter1', type: FILTER_TYPES.EQUAL, value: 'value1' },
        { property: 'filter2', type: FILTER_TYPES.LIKE, value: 'value2' },
      ]);
    });

    it('should return mapped filters', () => {
      const req = createMockRequest({
        query: { filter: { filter1: 'value1', filter2: { [FILTER_TYPES.LIKE]: 'value2' } } },
      });

      const result = buildFilterParams(req, [
        ['filter1', 'mappedFilter1'],
        ['filter2', 'mappedFilter2'],
      ]);

      expect(result).toEqual([
        { property: 'mappedFilter1', type: FILTER_TYPES.EQUAL, value: 'value1' },
        { property: 'mappedFilter2', type: FILTER_TYPES.LIKE, value: 'value2' },
      ]);
    });

    it('should return filters with null values if they are empty strings', () => {
      const req = createMockRequest({
        query: { filter: { filter1: '', filter2: { [FILTER_TYPES.LIKE]: '' } } },
      });

      const result = buildFilterParams(req);

      expect(result).toEqual([
        { property: 'filter1', type: FILTER_TYPES.EQUAL, value: null },
        { property: 'filter2', type: FILTER_TYPES.LIKE, value: null },
      ]);
    });
  });
});
