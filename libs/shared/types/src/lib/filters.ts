import { ObjectValue } from './util';

export const FILTER_TYPES = {
  EQUAL: 'eq',
  LIKE: 'like',
} as const;

export type FilterType = ObjectValue<typeof FILTER_TYPES>;

export interface FilterParams {
  property: string;
  type: FilterType;
  value: string | null;
}
