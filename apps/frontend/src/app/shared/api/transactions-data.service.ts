import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseWithMeta } from '../models/api-response';
import { PaginationConfig } from '../models/pagination-config';
import { PaginationMeta } from '../models/pagination-meta';
import { Transaction } from '../models/transaction';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class TransactionsDataService {
  static readonly DEFAULT_PAGE_SIZE: number = 20;

  private readonly baseApiService: BaseApiService = inject(BaseApiService);

  getTransactions(
    accountId: string,
    { page, pageSize }: PaginationConfig = { page: 1 },
  ): Observable<ApiResponseWithMeta<Array<Transaction>, PaginationMeta>> {
    const usedPageSize = pageSize ?? TransactionsDataService.DEFAULT_PAGE_SIZE;

    return this.baseApiService.get<ApiResponseWithMeta<Array<Transaction>, PaginationMeta>>(
      `accounts/${accountId}/transactions?page=${page}&page-size=${usedPageSize}`,
    );
  }
}
