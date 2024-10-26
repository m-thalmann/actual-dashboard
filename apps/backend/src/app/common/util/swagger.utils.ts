import { getSchemaPath } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { PaginationMetaDto } from '../dto/pagination-meta.dto';

export function getResponseSchema(
  // eslint-disable-next-line @typescript-eslint/ban-types
  dto: Function | string,
  options?: { isArray?: boolean; hasPagination?: boolean },
): SchemaObject {
  const dataSchema = options?.isArray
    ? { type: 'array', items: { $ref: getSchemaPath(dto) } }
    : { $ref: getSchemaPath(dto) };

  const properties: SchemaObject['properties'] = {
    data: dataSchema,
  };

  const required = ['data'];

  if (options?.hasPagination) {
    properties.meta = {
      $ref: getSchemaPath(PaginationMetaDto),
    };
    required.push('meta');
  }

  return {
    type: 'object',
    properties,
    required,
  };
}
