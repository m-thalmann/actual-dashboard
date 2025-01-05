import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Account } from '../shared/models/account';

@Injectable({
  providedIn: 'root',
})
export class LayoutFacadeService {
  protected readonly _selectedAccount: WritableSignal<Account | undefined> = signal<Account | undefined>(undefined);
  readonly selectedAccount: Signal<Account | undefined> = this._selectedAccount.asReadonly();

  protected readonly _backButtonUrl: WritableSignal<string | null> = signal<string | null>(null);
  readonly backButtonUrl: Signal<string | null> = this._backButtonUrl.asReadonly();

  setSelectedAccount(account: Account | undefined): void {
    this._selectedAccount.set(account);
  }

  showBackButton(url: string | null = '/'): void {
    this._backButtonUrl.set(url);
  }
}
