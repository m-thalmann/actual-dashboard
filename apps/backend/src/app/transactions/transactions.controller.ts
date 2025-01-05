import { PaginationMeta } from '@app/shared-types';
import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Query, Req, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Transaction } from '../common/actual/actual.models';
import { ActualService } from '../common/actual/actual.service';
import { buildFilterParams } from '../common/util/filter.utils';
import { buildPaginationMeta, buildPaginationParams } from '../common/util/pagination.utils';
import { ApiFilterQueryParams, ApiPaginationQueryParams, getResponseSchema } from '../common/util/swagger.utils';
import { CashFlowEntry } from './dto/cash-flow-entry.dto';
import { TransactionDto } from './dto/transaction.dto';

@Controller('accounts/:id/transactions')
@ApiTags('Transaction')
@ApiBearerAuth()
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

  @Post('export')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export transactions of an account' })
  @ApiProduces('text/csv')
  @ApiOkResponse({
    schema: { type: 'string', example: 'Date,Payee,Notes,Category,Amount' },
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiQuery({ name: 'start-date' })
  @ApiQuery({ name: 'end-date' })
  @ApiFilterQueryParams()
  async export(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') accountId: string,
    @Query('start-date') startDate: string,
    @Query('end-date') endDate: string,
  ): Promise<Response> {
    const filterParams = buildFilterParams(request, [['category', 'category.name'], 'notes', 'date']);
    const csvString = await this.actualService.exportTransactionsCsvString(accountId, {
      startDate,
      endDate,
      filters: filterParams,
    });

    if (csvString === null) {
      throw new NotFoundException();
    }

    response.setHeader('Content-Type', 'text/csv');
    response.attachment(`actual-export-${accountId}-${startDate}-${endDate}.csv`);
    return response.send(csvString);
  }

  @Get('cash-flow')
  @ApiOperation({ summary: 'Get cash flow of a given period' })
  @ApiOkResponse({
    schema: getResponseSchema(CashFlowEntry, { isArray: true }),
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiQuery({ name: 'start-date' })
  @ApiQuery({ name: 'end-date' })
  async getCashFlowOfPeriod(
    @Param('id') accountId: string,
    @Query('start-date') startDate: string,
    @Query('end-date') endDate: string,
  ): Promise<{ data: Array<CashFlowEntry> }> {
    const cashFlowEntries = await this.actualService.getCashFlowEntries(accountId, {
      startDate,
      endDate,
    });
    return { data: cashFlowEntries };
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
