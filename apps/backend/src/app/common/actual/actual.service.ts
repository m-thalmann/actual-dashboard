import { downloadBudget, init, q, runQuery, shutdown, sync } from '@actual-app/api';
import { Query } from '@actual-app/api/@types/loot-core/shared/query';
import { FilterParams } from '@app/shared-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { PaginationParams } from '../util/pagination.utils';
import { Account, Transaction } from './actual.models';

// TODO: document why this path is correct and maybe move some place else
const DATA_DIR = path.resolve(__dirname, 'data');

@Injectable()
export class ActualService {
  private readonly serverUrl: string;
  private readonly password: string;
  private readonly syncId: string;
  private readonly filePassword: string | undefined;
  private readonly allowedAccounts: Array<string> | null;

  constructor(private readonly configService: ConfigService) {
    const serverUrl = this.configService.get<string>('ACTUAL_SERVER_URL');
    const password = this.configService.get<string>('ACTUAL_SERVER_PASSWORD');
    const syncId = this.configService.get<string>('ACTUAL_SERVER_SYNC_ID');

    if (serverUrl === undefined || password === undefined || syncId === undefined) {
      throw new Error('Missing Actual Server required configuration');
    }

    this.serverUrl = serverUrl;
    this.password = password;
    this.syncId = syncId;
    this.filePassword = this.configService.get<string>('ACTUAL_SERVER_FILE_PASSWORD');

    const configAllowedAccounts = this.configService.get<string>('ACTUAL_SERVER_ALLOWED_ACCOUNTS');

    if (configAllowedAccounts === '*' || configAllowedAccounts === undefined) {
      this.allowedAccounts = null;
    } else {
      this.allowedAccounts = configAllowedAccounts.split(',');
    }
  }

  async init(): Promise<void> {
    await init({
      serverURL: this.serverUrl,
      password: this.password,

      dataDir: DATA_DIR,
    });

    await downloadBudget(this.syncId, { password: this.filePassword });
  }

  async reload(): Promise<void> {
    await sync();
  }

  async getAccounts(): Promise<Array<Account>> {
    const filter: Record<string, unknown> = {};

    if (this.allowedAccounts !== null) {
      filter.$or = this.allowedAccounts.map((account) => ({ account: { $eq: account } }));
    }

    const query = q('transactions')
      .filter(filter)
      .groupBy('account')
      .select([{ id: 'account' }, { name: 'account.name' }, { amount: { $sum: '$amount' } }]);

    const queryData = (await runQuery(query)) as { data: Array<Account> };

    return queryData.data;
  }

  async getAccountDetails(accountId: string): Promise<Account | null> {
    if (!this.isAllowedAccount(accountId)) {
      return null;
    }

    const query = q('transactions')
      .filter({ account: { $eq: accountId } })
      .groupBy('account')
      .select([{ id: 'account' }, { name: 'account.name' }, { amount: { $sum: '$amount' } }]);

    const queryData = (await runQuery(query)) as { data: Array<Account> };

    return queryData.data[0] ?? null;
  }

  async getTransactions(
    accountId: string,
    options?: { pagination?: PaginationParams; filters?: Array<FilterParams> },
  ): Promise<{ transactions: Array<Transaction>; totalAmount: number }> {
    if (!this.isAllowedAccount(accountId)) {
      return { transactions: [], totalAmount: 0 };
    }
    // TODO: somehow include the running balance? (-> carryover)

    const baseQuery = this.applyFilters(
      q('transactions').filter({ account: { $eq: accountId } }),
      options?.filters ?? [],
    );

    const query = baseQuery
      .select(['notes', 'amount', { payee: 'payee.name' }, 'date', { category: 'category.name' }])
      .limit(options?.pagination?.pageSize)
      .offset(options?.pagination?.offset);

    const totalAmountQuery = baseQuery.select([{ total: { $count: '*' } }]);

    const [transactions, totalAmount] = await Promise.all([
      this.runQuery<Array<Transaction>>(query),
      this.runQuery<{ 0: { total: number } }>(totalAmountQuery),
    ]);

    return { transactions, totalAmount: totalAmount[0].total };
  }

  async destroy(): Promise<void> {
    await shutdown();
  }

  isAllowedAccount(accountId: string): boolean {
    return this.allowedAccounts === null || this.allowedAccounts.includes(accountId);
  }

  private async runQuery<T>(query: Query): Promise<T> {
    const data = (await runQuery(query)) as { data: T };

    return data.data;
  }

  private applyFilters(query: Query, filters: Array<FilterParams>): Query {
    return filters.reduce((acc, filter) => {
      switch (filter.type) {
        case 'eq':
          return acc.filter({ [filter.property]: { $eq: filter.value } });
        case 'like':
          return acc.filter({ [filter.property]: { $like: filter.value } });
        default:
          return acc;
      }
    }, query);
  }
}