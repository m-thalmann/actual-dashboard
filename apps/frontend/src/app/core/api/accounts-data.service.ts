import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class AccountsDataService {
  private readonly baseApiService: BaseApiService = inject(BaseApiService);

  getAccounts(): Observable<Account> {
    return this.baseApiService.get<Account>(`accounts`);
  }

  getAccountBalance(accountId: string): Observable<number | null> {
    return this.baseApiService.get<number | null>(`accounts/${accountId}/balance`);
  }
}
