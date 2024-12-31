import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { AccountsDataService } from '../shared/api/accounts-data.service';
import { ErrorDisplayComponent } from '../shared/components/error-display/error-display.component';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';
import { Account } from '../shared/models/account';
import { AccountCardComponent } from './account-card/account-card.component';

@Component({
  selector: 'app-accounts-overview',
  imports: [CommonModule, AccountCardComponent, ErrorDisplayComponent, LoadingSpinnerComponent],
  templateUrl: './accounts-overview.component.html',
  styleUrl: './accounts-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsOverviewComponent {
  private readonly accountsDataService: AccountsDataService = inject(AccountsDataService);

  readonly loading: WritableSignal<boolean> = signal(true);

  protected readonly accounts$: Observable<Array<Account>> = this.accountsDataService.getAccounts().pipe(
    map((accounts) => accounts.data),
    tap(() => this.loading.set(false)),
  );

  readonly loadingError: Signal<Error | undefined> = toSignal(
    this.accounts$.pipe(
      switchMap(() => EMPTY),
      catchError((error: unknown) => of(error as Error)),
      tap(() => this.loading.set(false)),
    ),
  );

  readonly accounts: Signal<Array<Account> | undefined> = toSignal(this.accounts$.pipe(catchError(() => EMPTY)));
}
