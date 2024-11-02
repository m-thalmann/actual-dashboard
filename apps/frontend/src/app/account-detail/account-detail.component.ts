import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FILTER_TYPES, FilterParams } from '@app/shared-types';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { AccountsDataService } from '../shared/api/accounts-data.service';
import { TransactionsDataService } from '../shared/api/transactions-data.service';
import { InputFieldComponent } from '../shared/components/input-field/input-field.component';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { SelectFieldComponent } from '../shared/components/select-field/select-field.component';
import { Account } from '../shared/models/account';
import { ApiResponseWithMeta } from '../shared/models/api-response';
import { PaginationMeta } from '../shared/models/pagination-meta';
import { Transaction } from '../shared/models/transaction';
import { AccountDetailFilterComponent } from './account-detail-filter/account-detail-filter.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    PaginationComponent,
    InputFieldComponent,
    SelectFieldComponent,
    TransactionsTableComponent,
    AccountDetailFilterComponent,
  ],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailComponent {
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly accountsDataService: AccountsDataService = inject(AccountsDataService);
  private readonly transactionsDataService: TransactionsDataService = inject(TransactionsDataService);

  readonly accountId$: Observable<string> = this.activatedRoute.paramMap.pipe(
    map((params) => params.get('accountId')),
    filter((id) => id !== null),
    distinctUntilChanged(),
    shareReplay({
      refCount: true,
    }),
  );

  // TODO: handle 404 -> null
  readonly accountDetails: Signal<Account | undefined> = toSignal(
    this.accountId$.pipe(
      switchMap((id) => this.accountsDataService.getAccountDetails(id)),
      map((account) => account.data ?? undefined),
    ),
  );

  readonly page$: Observable<number> = this.activatedRoute.queryParamMap.pipe(
    map((params) => parseInt(params.get('page') ?? '1')),
    startWith(1),
    shareReplay({
      refCount: true,
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
    }),
  );
  readonly filters: Signal<Array<FilterParams> | undefined> = toSignal(this.filters$);

  readonly transactions: Signal<ApiResponseWithMeta<Array<Transaction>, PaginationMeta> | undefined> = toSignal(
    combineLatest([this.accountId$, this.page$, this.filters$]).pipe(
      debounceTime(1), // prevent multiple requests when changing filters and page at the same time
      switchMap(([id, page, filters]) =>
        this.transactionsDataService.getTransactions(id, {
          pagination: { page },
          filters,
        }),
      ),
    ),
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

  private applyFilterParams(params: Record<string, string | null>, resetPage: boolean = true): void {
    if (resetPage && !('page' in params)) {
      params.page = null;
    }

    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }
}
