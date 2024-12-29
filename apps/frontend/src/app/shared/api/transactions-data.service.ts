import { inject, Injectable } from '@angular/core';
import { FilterParams } from '@app/shared-types';
import { Observable, tap } from 'rxjs';
import { ApiResponse, ApiResponseWithMeta } from '../models/api-response';
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

  getCategories(accountId: string): Observable<ApiResponse<Array<string | null>>> {
    return this.baseApiService.get<ApiResponse<Array<string | null>>>(`accounts/${accountId}/transactions/categories`);
  }

  downloadExport(
    accountId: string,
    options: { startDate: string; endDate: string; filters?: Array<FilterParams> },
  ): void {
    this.baseApiService
      .post<string>(
        `accounts/${accountId}/transactions/export`,
        {},
        {
          filters: options.filters,
          queryParams: { 'start-date': options.startDate, 'end-date': options.endDate },
          contentType: 'text/csv',
        },
        true,
      )
      .pipe(
        tap((response) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const blob = new Blob([response.body!], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = response.headers.get('content-disposition')?.match(/filename="([^"]+)"/)?.[1] ?? 'export.csv';
          link.click();
        }),
      )
      .subscribe();
  }
}
