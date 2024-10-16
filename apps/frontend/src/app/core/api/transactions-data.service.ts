import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationConfig } from '../models/pagination-config';
import { Transaction } from '../models/transaction';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class TransactionsDataService {
  static readonly DEFAULT_PAGE_SIZE: number = 20;

  private readonly baseApiService: BaseApiService = inject(BaseApiService);

  getTransactions(
    accountId: string,
    { page, pageSize }: PaginationConfig = { page: 1 },
  ): Observable<Array<Transaction>> {
    return this.baseApiService.get<Array<Transaction>>(
      `accounts/${accountId}/transactions?page=${page}&page-size=${pageSize ?? TransactionsDataService.DEFAULT_PAGE_SIZE}`,
    );
  }
}
