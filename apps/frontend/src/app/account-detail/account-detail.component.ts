import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, filter, map, Observable, startWith, switchMap } from 'rxjs';
import { AccountsDataService } from '../core/api/accounts-data.service';
import { TransactionsDataService } from '../core/api/transactions-data.service';
import { Account } from '../core/models/account';
import { Transaction } from '../core/models/transaction';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailComponent {
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

  // TODO: handle 404
  readonly accountDetails: Signal<Account | undefined> = toSignal(
    this.accountId$.pipe(switchMap((id) => this.accountsDataService.getAccountDetails(id))),
  );

  readonly transactions: Signal<Array<Transaction> | undefined> = toSignal(
    combineLatest([this.accountId$, this.page$]).pipe(
      switchMap(([id, page]) => this.transactionsDataService.getTransactions(id, { page })),
    ),
  );
}
