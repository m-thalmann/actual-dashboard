import { inject, Injectable } from '@angular/core';
import { FilterParams } from '@app/shared-types';
import { Observable } from 'rxjs';
import { ApiResponseWithMeta } from '../models/api-response';
import { PaginationConfig } from '../models/pagination-config';
import { PaginationMeta } from '../models/pagination-meta';
import { Transaction } from '../models/transaction';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class TransactionsDataService {
  private readonly baseApiService: BaseApiService = inject(BaseApiService);

  getTransactions(
    accountId: string,
    options?: { pagination: PaginationConfig; filters?: Array<FilterParams> },
  ): Observable<ApiResponseWithMeta<Array<Transaction>, PaginationMeta>> {
    return this.baseApiService.get<ApiResponseWithMeta<Array<Transaction>, PaginationMeta>>(
      `accounts/${accountId}/transactions`,
      options,
    );
  }
}
