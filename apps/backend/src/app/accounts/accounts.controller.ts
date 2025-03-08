import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Account } from '../common/actual/actual.models';
import { ActualService } from '../common/actual/actual.service';
import { getDateString } from '../common/util/date.utils';
import { getResponseSchema } from '../common/util/swagger.utils';
import { AccountDto } from './dto/account.dto';
import { BalanceHistoryEntry } from './dto/balance-history-entry.dto';

@Controller('accounts')
@ApiTags('Account')
@ApiBearerAuth()
@ApiExtraModels(AccountDto, BalanceHistoryEntry)
export class AccountsController {
  static readonly MAX_DAYS_BALANCE_HISTORY: number = 365;

  constructor(private readonly actualService: ActualService) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiOkResponse({
    schema: getResponseSchema(AccountDto, { isArray: true }),
  })
  async findAll(): Promise<{ data: Array<Account> }> {
    const accounts = await this.actualService.getAccounts();

    return { data: accounts };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account details' })
  @ApiOkResponse({
    schema: getResponseSchema(AccountDto),
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id') accountId: string): Promise<{ data: Account }> {
    const details = await this.actualService.getAccountDetails(accountId);

    if (details === null) {
      throw new NotFoundException();
    }

    return { data: details };
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get account balance' })
  @ApiOkResponse({
    schema: getResponseSchema('number'),
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiQuery({ name: 'date', required: false })
  async getBalance(@Param('id') accountId: string, @Query('date') date: string | undefined): Promise<{ data: number }> {
    const cutoffDate = date ? new Date(date) : undefined;

    const balance = await this.actualService.getAccountBalance(accountId, cutoffDate);

    return { data: balance };
  }

  @Get(':id/balance-history')
  @ApiOperation({ summary: 'Get balance history' })
  @ApiOkResponse({
    schema: getResponseSchema(BalanceHistoryEntry, { isArray: true }),
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiQuery({ name: 'start-date', required: true })
  @ApiQuery({ name: 'end-date', required: true })
  async getBalanceHistory(
    @Param('id') accountId: string,
    @Query('start-date') startDate: string,
    @Query('end-date') endDate: string,
  ): Promise<{ data: Array<BalanceHistoryEntry> }> {
    const end = new Date(endDate);
    const date = new Date(startDate);

    const datesMsDiff = Math.abs(date.getTime() - end.getTime());
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const datesDayDiff = Math.ceil(datesMsDiff / 1000 / 60 / 60 / 24);

    if (datesDayDiff >= AccountsController.MAX_DAYS_BALANCE_HISTORY) {
      throw new BadRequestException('Date range too large');
    }

    const entries = [];

    // eslint-disable-next-line no-unmodified-loop-condition
    while (date <= end) {
      const dateString = getDateString(date);

      entries.push(
        this.actualService
          .getAccountBalance(accountId, new Date(date))
          .then((balance) => ({ date: dateString, balance })),
      );

      date.setDate(date.getDate() + 1);
    }

    return { data: await Promise.all(entries) };
  }
}
