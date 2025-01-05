import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FILTER_TYPES, FilterParams, PaginationMeta } from '@app/shared-types';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { TransactionsDataService } from '../../shared/api/transactions-data.service';
import { ErrorDisplayComponent } from '../../shared/components/error-display/error-display.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ApiResponseWithMeta } from '../../shared/models/api-response';
import { Transaction } from '../../shared/models/transaction';
import { AccountDetailExportComponent } from './account-detail-export/account-detail-export.component';
import { AccountDetailFilterComponent } from './account-detail-filter/account-detail-filter.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';

@Component({
  selector: 'app-account-detail-transactions-table',
  imports: [
    CommonModule,
    ErrorDisplayComponent,
    LoadingSpinnerComponent,
    TransactionsTableComponent,
    PaginationComponent,
    AccountDetailFilterComponent,
    AccountDetailExportComponent,
  ],
  templateUrl: './account-detail-transactions-table.component.html',
  styleUrl: './account-detail-transactions-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailTransactionsTableComponent {
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly transactionsDataService: TransactionsDataService = inject(TransactionsDataService);

  readonly accountId: InputSignal<string> = input.required<string>();
  protected readonly accountId$: Observable<string> = toObservable(this.accountId);

  readonly page$: Observable<number> = this.activatedRoute.queryParamMap.pipe(
    map((params) => parseInt(params.get('page') ?? '1')),
    startWith(1),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    }),
  );
  readonly page: Signal<number> = toSignal(this.page$, { requireSync: true });

  readonly filters$: Observable<Array<FilterParams> | undefined> = this.activatedRoute.queryParamMap.pipe(
    map((params) => {
      const filters = [];

      const search = params.get('search');
      const category = params.get('category');

      if (search !== null) {
        filters.push({ property: 'notes', type: FILTER_TYPES.LIKE, value: search });
      }

      if (category !== null) {
        filters.push({ property: 'category', type: FILTER_TYPES.EQUAL, value: category });
      }

      return filters.length === 0 ? undefined : filters;
    }),
    distinctUntilChanged(),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    }),
  );
  readonly filters: Signal<Array<FilterParams> | undefined> = toSignal(this.filters$);

  readonly loading: WritableSignal<boolean> = signal(true);

  protected readonly transactions$: Observable<ApiResponseWithMeta<Array<Transaction>, PaginationMeta>> = combineLatest(
    [this.accountId$, this.page$, this.filters$],
  ).pipe(
    debounceTime(1), // prevent multiple requests when changing filters and page at the same time
    tap(() => this.loading.set(true)),
    switchMap(([id, page, filters]) =>
      this.transactionsDataService.getTransactions(id, {
        pagination: { page },
        filters,
      }),
    ),
    tap(() => this.loading.set(false)),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  readonly loadingError: Signal<Error | undefined> = toSignal(
    this.transactions$.pipe(
      switchMap(() => EMPTY),
      catchError((error: unknown) => of(error as Error)),
      tap(() => this.loading.set(false)),
    ),
  );

  readonly transactions: Signal<ApiResponseWithMeta<Array<Transaction>, PaginationMeta> | undefined> = toSignal(
    this.transactions$,
  );

  updatePage(page: number): void {
    this.applyFilterParams({ page: page.toString() });
  }

  doSearch(search: string | null): void {
    this.applyFilterParams({ search });
  }

  changeCategory(category: string | null): void {
    this.applyFilterParams({ category });
  }

  downloadExport(startDate: string, endDate: string): void {
    const accountId = this.accountId();
    this.transactionsDataService.downloadExport(accountId, { startDate, endDate, filters: this.filters() });
  }

  private applyFilterParams(params: Record<string, string | null>, resetPage: boolean = true): void {
    if (resetPage && !('page' in params)) {
      params.page = null;
    }

    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }
}
