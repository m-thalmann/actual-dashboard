import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account';
import { ApiResponse } from '../models/api-response';
import { BalanceHistoryEntry } from '../models/balance-history-entry';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class AccountsDataService {
  private readonly baseApiService: BaseApiService = inject(BaseApiService);

  getAccounts(): Observable<ApiResponse<Array<Account>>> {
    return this.baseApiService.get<ApiResponse<Array<Account>>>(`accounts`, { emitReload: true });
  }

  getAccountDetails(accountId: string): Observable<ApiResponse<Account>> {
    return this.baseApiService.get<ApiResponse<Account>>(`accounts/${accountId}`, { emitReload: true });
  }

  getBalance(accountId: string, date?: string): Observable<ApiResponse<number>> {
    const queryParams = date ? { date } : undefined;
    return this.baseApiService.get<ApiResponse<number>>(`accounts/${accountId}/balance`, {
      queryParams,
      emitReload: true,
    });
  }

  getBalanceHistory(
    accountId: string,
    options: { startDate: string; endDate: string },
  ): Observable<ApiResponse<Array<BalanceHistoryEntry>>> {
    return this.baseApiService.get<ApiResponse<Array<BalanceHistoryEntry>>>(`accounts/${accountId}/balance-history`, {
      queryParams: { 'start-date': options.startDate, 'end-date': options.endDate },
      emitReload: true,
    });
  }
}
