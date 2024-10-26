import { FILTER_TYPES, FilterParams, FilterType } from '@app/shared-types';
import { Request } from 'express';

function isSimpleFilter(filter: unknown): filter is string {
  return typeof filter === 'string';
}

function isComplexFilter<T extends FilterType>(filter: unknown): filter is { [key in T]: string } {
  if (filter === null || typeof filter !== 'object') {
    return false;
  }

  const keys = Object.keys(filter);

  if (keys.length !== 1) {
    return false;
  }

  const [filterType] = keys;

  const isSupportedFilterType = Object.values<string>(FILTER_TYPES).includes(filterType);

  if (!isSupportedFilterType) {
    return false;
  }

  return typeof filter[filterType as keyof object] === 'string';
}

export function buildFilterParams(
  req: Request,
  allowedProperties?: Array<string | [string, string]>,
): Array<FilterParams> {
  const filters = req.query.filter;

  if (filters === undefined || typeof filters !== 'object') {
    return [];
  }

  return Object.entries(filters)
    .map<FilterParams | undefined>(([filter, filterProps]) => {
      const allowedFilterProperty =
        allowedProperties === undefined
          ? filter
          : allowedProperties.find((prop) => (typeof prop === 'string' ? prop === filter : prop[0] === filter));

      if (allowedFilterProperty === undefined) {
        return undefined;
      }

      const filterProperty =
        typeof allowedFilterProperty === 'string' ? allowedFilterProperty : allowedFilterProperty[1];

      if (isSimpleFilter(filterProps)) {
        let filterValue: string | null = filterProps;

        if (filterValue.length === 0) {
          filterValue = null;
        }

        return {
          property: filterProperty,
          type: FILTER_TYPES.EQ,
          value: filterValue,
        };
      }

      if (isComplexFilter(filterProps)) {
        const [filterType] = Object.keys(filterProps);
        let filterValue: string | null = filterProps[filterType as keyof object] as string;

        if (filterValue.length === 0) {
          filterValue = null;
        }

        return {
          property: filterProperty,
          type: filterType as FilterType,
          value: filterValue,
        };
      }

      return undefined;
    })
    .filter((filterParams): filterParams is FilterParams => filterParams !== undefined);
}
