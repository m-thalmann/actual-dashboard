import { ObjectValue } from './util';

export const FILTER_TYPES = {
  EQUAL: 'eq',
  LIKE: 'like',
  GREATER_THAN_OR_EQUAL: 'gte',
  LESS_THAN_OR_EQUAL: 'lte',
} as const;

export type FilterType = ObjectValue<typeof FILTER_TYPES>;

export interface FilterParams {
  property: string;
  type: FilterType;
  value: string | null;
}
