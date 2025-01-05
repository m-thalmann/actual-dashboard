import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ObjectValue } from '@app/shared-types';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { LayoutFacadeService } from '../layouts/layout-facade.service';
import { AccountsDataService } from '../shared/api/accounts-data.service';
import { ErrorDisplayComponent } from '../shared/components/error-display/error-display.component';
import { Account } from '../shared/models/account';
import { AccountDetailGraphsComponent } from './account-detail-graphs/account-detail-graphs.component';
import { AccountDetailTransactionsTableComponent } from './account-detail-transactions-table/account-detail-transactions-table.component';

const VIEWS = {
  TRANSACTIONS: 'transactions',
  GRAPHS: 'graphs',
} as const;

type ViewId = ObjectValue<typeof VIEWS>;

@Component({
  selector: 'app-account-detail',
  imports: [
    CommonModule,
    RouterLink,
    AccountDetailTransactionsTableComponent,
    AccountDetailGraphsComponent,
    ErrorDisplayComponent,
  ],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailComponent implements OnDestroy {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly accountsDataService: AccountsDataService = inject(AccountsDataService);
  private readonly layoutFacade: LayoutFacadeService = inject(LayoutFacadeService);

  readonly accountId$: Observable<string> = this.activatedRoute.paramMap.pipe(
    map((params) => params.get('accountId')),
    filter((id) => id !== null),
    distinctUntilChanged(),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    }),
  );

  readonly accountId: Signal<string | undefined> = toSignal(this.accountId$);

  protected readonly accountDetails$: Observable<Account> = this.accountId$.pipe(
    switchMap((id) => this.accountsDataService.getAccountDetails(id)),
    map((account) => account.data),
    tap((account: Account) => this.layoutFacade.setSelectedAccount(account)),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  readonly detailsLoadingError: Signal<Error | undefined> = toSignal(
    this.accountDetails$.pipe(
      switchMap(() => EMPTY),
      catchError((error: unknown) => of(error as Error)),
    ),
  );

  readonly accountDetails: Signal<Account | undefined> = toSignal(this.accountDetails$);

  readonly view$: Observable<ViewId> = this.activatedRoute.queryParamMap.pipe(
    map((params) => {
      const view = params.get('view');
      return view !== null && Object.values(VIEWS as Record<string, string>).includes(view)
        ? (view as ViewId)
        : VIEWS.TRANSACTIONS;
    }),
    startWith(VIEWS.TRANSACTIONS),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    }),
  );
  readonly view: Signal<ViewId> = toSignal(this.view$, { requireSync: true });

  constructor() {
    this.layoutFacade.showBackButton();
  }

  ngOnDestroy(): void {
    this.layoutFacade.setSelectedAccount(undefined);
    this.layoutFacade.showBackButton(null);
  }
}
