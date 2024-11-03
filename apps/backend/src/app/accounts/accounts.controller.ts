import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Account } from '../common/actual/actual.models';
import { ActualService } from '../common/actual/actual.service';
import { getResponseSchema } from '../common/util/swagger.utils';
import { AccountDto } from './dto/account.dto';

@Controller('accounts')
@ApiTags('Account')
@ApiBearerAuth()
@ApiExtraModels(AccountDto)
export class AccountsController {
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
}
