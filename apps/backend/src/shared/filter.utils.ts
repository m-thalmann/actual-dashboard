import { Request } from 'express';

export enum FilterType {
  Eq = 'eq',
  Like = 'like',
}

export interface FilterParams {
  filterType: FilterType;
  filterValue: string;
}

export function buildFilterParams(req: Request): FilterParams | undefined {
  const filters = req.query.filter;
  if (filters === undefined || typeof filters !== 'object') {
    return undefined;
  }

  let filterParams: FilterParams = {
    filterType: FilterType.Eq,
    filterValue: '',
  };
  Object.entries(filters).forEach(([filter, filterProps]) => {
    let filterType: FilterType = FilterType.Eq;
    let filterValue: string = '';
    if (typeof filterProps === 'string') {
      filterType = FilterType.Eq;
      filterValue = filterProps;
      filterParams = {
        filterType,
        filterValue,
      };
    } else if (filterProps instanceof Object) {
      filterType = Object.keys(filterProps)[0] as FilterType;
      filterValue = filter;
      filterParams = {
        filterType,
        filterValue,
      };
    }
  });

  return filterParams;
}
