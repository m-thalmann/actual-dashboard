import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, map, Observable, startWith, switchMap } from 'rxjs';
import { AccountsDataService } from '../shared/api/accounts-data.service';
import { TransactionsDataService } from '../shared/api/transactions-data.service';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { Account } from '../shared/models/account';
import { ApiResponseWithMeta } from '../shared/models/api-response';
import { PaginationMeta } from '../shared/models/pagination-meta';
import { Transaction } from '../shared/models/transaction';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, AsyncPipe, PaginationComponent],
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
  );

  readonly page$: Observable<number> = this.activatedRoute.queryParamMap.pipe(
    map((params) => parseInt(params.get('page') ?? '1')),
    startWith(1),
  );

  readonly page: Signal<number> = toSignal(this.page$, { requireSync: true });

  // TODO: handle 404 -> null
  readonly accountDetails: Signal<Account | undefined> = toSignal(
    this.accountId$.pipe(
      switchMap((id) => this.accountsDataService.getAccountDetails(id)),
      map((account) => account.data ?? undefined),
    ),
  );

  readonly transactions: Signal<ApiResponseWithMeta<Array<Transaction>, PaginationMeta> | undefined> = toSignal(
    combineLatest([this.accountId$, this.page$]).pipe(
      switchMap(([id, page]) => this.transactionsDataService.getTransactions(id, { page })),
    ),
  );

  updatePage(page: number): void {
    this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
  }
}
