import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AccountsDataService } from '../../core/api/accounts-data.service';
import { Account } from '../../core/models/account';

@Component({
  selector: 'app-accounts-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accounts-page.component.html',
  styleUrl: './accounts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsPageComponent {
  private readonly accountsDataService: AccountsDataService = inject(AccountsDataService);

  readonly accounts: Signal<Array<Account> | undefined> = toSignal(this.accountsDataService.getAccounts());
}
