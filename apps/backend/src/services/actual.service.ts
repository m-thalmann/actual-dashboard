import { downloadBudget, init, q, runQuery, shutdown, sync } from '@actual-app/api';
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

  // async getAccountBalance(accountId: string): Promise<number> {
  //   if (!this.isAllowedAccount(accountId)) {
  //     return 0;
  //   }

  //   const query = q('transactions')
  //     .filter({ account: { $eq: accountId } })
  //     .select([{ amount: { $sum: '$amount' } }]);

  //   const queryData = (await runQuery(query)) as { data: [{ amount: number }] };

  //   return queryData.data[0].amount;
  // }

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

  async getTransactions(accountId: string, limit?: number, offset?: number): Promise<Array<Transaction>> {
    if (!this.isAllowedAccount(accountId)) {
      return [];
    }
    // TODO: somehow include the running balance? (-> carryover)

    const query = q('transactions')
      .filter({ account: { $eq: accountId } })
      .select(['notes', 'amount', { payee: 'payee.name' }, 'date', { category: 'category.name' }])
      .limit(limit)
      .offset(offset);

    const queryData = (await runQuery(query)) as { data: Array<Transaction> };

    return queryData.data;
  }

  async destroy(): Promise<void> {
    await shutdown();
  }

  isAllowedAccount(accountId: string): boolean {
    return this.config.allowedAccounts === null || this.config.allowedAccounts.includes(accountId);
  }
}
