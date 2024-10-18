import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AccountsDataService } from '../core/api/accounts-data.service';
import { Account } from '../core/models/account';
import { AccountCardComponent } from './account-card/account-card.component';

@Component({
  selector: 'app-accounts-overview',
  standalone: true,
  imports: [CommonModule, AccountCardComponent],
  templateUrl: './accounts-overview.component.html',
  styleUrl: './accounts-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsOverviewComponent {
  private readonly accountsDataService: AccountsDataService = inject(AccountsDataService);

  readonly accounts: Signal<Array<Account> | undefined> = toSignal(this.accountsDataService.getAccounts());
}
