import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, switchMap } from 'rxjs';
import { AccountsDataService } from '../core/api/accounts-data.service';
import { TransactionsDataService } from '../core/api/transactions-data.service';
import { Account } from '../core/models/account';
import { Transaction } from '../core/models/transaction';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
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

  // TODO: handle 404
  readonly accountDetails: Signal<Account | undefined> = toSignal(
    this.accountId$.pipe(switchMap((id) => this.accountsDataService.getAccountDetails(id))),
  );

  readonly transactions: Signal<Array<Transaction> | undefined> = toSignal(
    this.accountId$.pipe(switchMap((id) => this.transactionsDataService.getTransactions(id))),
  );
}
