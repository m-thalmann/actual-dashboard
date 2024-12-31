import { applyDecorators } from '@nestjs/common';
import { ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { PaginationMetaDto } from '../dto/pagination-meta.dto';

export function getResponseSchema(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  dto: Function | string,
  options?: { isArray?: boolean; hasPagination?: boolean; nullable?: boolean; description?: string; example?: unknown },
): SchemaObject {
  let schema = undefined;

  if (typeof dto === 'string') {
    schema = { type: dto, nullable: options?.nullable, description: options?.description, example: options?.example };
  } else if (options?.nullable) {
    schema = {
      nullable: true,
      allOf: [{ $ref: getSchemaPath(dto) }],
      description: options.description,
      example: options.example,
    };
  } else {
    schema = { $ref: getSchemaPath(dto), description: options?.description, example: options?.example };
  }

  const dataSchema = options?.isArray ? { type: 'array', items: schema } : schema;

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

export function ApiPaginationQueryParams(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      schema: { type: 'integer', minimum: 1 },
      required: false,
      description: 'Page of the paginated items (starts with 1)',
    }),
    ApiQuery({
      name: 'page-size',
      schema: { type: 'integer', minimum: 1 },
      required: false,
      description: 'Amount of items per page',
    }),
  );
}

export function ApiFilterQueryParams(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiQuery({
      name: 'filter',
      required: false,
      description:
        'The column(s) (key) to filter by (value) with optional type of filter as secondary key. Use one of the following:\n- `filter[column]=value`\n- `filter[column][type]=value`\n\nLeave value empty for `null`',
      style: 'deepObject',
      explode: true,
      allowReserved: true,
      schema: {
        type: 'object',
        additionalProperties: {
          oneOf: [
            {
              type: 'object',
              properties: {
                eq: { type: 'string', example: 'Equals' },
                like: { type: 'string', example: 'Contains (case insensitive)' },
              },
            },
            { type: 'string' },
          ],
        },
      },
    }),
  );
}
