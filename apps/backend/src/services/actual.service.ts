import { downloadBudget, init, q, runQuery, shutdown, sync } from '@actual-app/api';
import { Query } from '@actual-app/api/@types/loot-core/shared/query';
import { FilterParams } from '../shared/filter.utils';
import { PaginationParams } from '../shared/pagination.utils';
import { Account, ActualConfig, Transaction } from './actual.models';

export class ActualService {
  constructor(private readonly config: ActualConfig) {}

  async init(): Promise<void> {
    await init({
      serverURL: this.config.serverUrl,
      password: this.config.password,

      dataDir: this.config.dataDir,
    });

    await downloadBudget(this.config.syncId, { password: this.config.filePassword });
  }

  async reload(): Promise<void> {
    await sync();
  }

  async getAccounts(): Promise<Array<Account>> {
    const filter: Record<string, unknown> = {};

    if (this.config.allowedAccounts !== null) {
      filter.$or = this.config.allowedAccounts.map((account) => ({ account: { $eq: account } }));
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
    return this.config.allowedAccounts === null || this.config.allowedAccounts.includes(accountId);
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
