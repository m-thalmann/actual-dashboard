import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Account } from '../shared/models/account';

@Injectable({
  providedIn: 'root',
})
export class LayoutFacadeService {
  protected readonly _selectedAccount: WritableSignal<Account | undefined> = signal<Account | undefined>(undefined);
  readonly selectedAccount: Signal<Account | undefined> = this._selectedAccount.asReadonly();

  setSelectedAccount(account: Account | undefined): void {
    this._selectedAccount.set(account);
  }
}
