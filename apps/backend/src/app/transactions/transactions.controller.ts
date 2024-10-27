import { PaginationMeta } from '@app/shared-types';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Transaction } from '../common/actual/actual.models';
import { ActualService } from '../common/actual/actual.service';
import { buildFilterParams } from '../common/util/filter.utils';
import { buildPaginationMeta, buildPaginationParams } from '../common/util/pagination.utils';
import { ApiFilterQueryParams, ApiPaginationQueryParams, getResponseSchema } from '../common/util/swagger.utils';
import { TransactionDto } from './dto/transaction.dto';

@Controller('accounts/:id/transactions')
@ApiTags('Transaction')
@ApiExtraModels(TransactionDto)
export class TransactionsController {
  constructor(private readonly actualService: ActualService) {}

  @Get()
  @ApiOperation({ summary: 'Get account transactions' })
  @ApiOkResponse({
    schema: getResponseSchema(TransactionDto, { isArray: true, hasPagination: true }),
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiPaginationQueryParams()
  @ApiFilterQueryParams()
  async findAll(
    @Param('id') accountId: string,
    @Req() request: Request,
  ): Promise<{ data: Array<Transaction>; meta: PaginationMeta }> {
    const paginationParams = buildPaginationParams(request);
    const filterParams = buildFilterParams(request, [['category', 'category.name'], 'notes', 'date']);

    const { transactions, totalAmount } = await this.actualService.getTransactions(accountId, {
      pagination: paginationParams,
      filters: filterParams,
    });

    return {
      data: transactions,
      meta: buildPaginationMeta(paginationParams, totalAmount),
    };
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get account transactions categories' })
  @ApiOkResponse({
    schema: getResponseSchema('string', { isArray: true, nullable: true }),
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findAllCategories(@Param('id') accountId: string): Promise<{ data: Array<string | null> }> {
    const categories = await this.actualService.getCategories(accountId);

    return { data: categories };
  }
}
