import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class AccountsDataService {
  private readonly baseApiService: BaseApiService = inject(BaseApiService);

  getAccounts(): Observable<Array<Account>> {
    return this.baseApiService.get<Array<Account>>(`accounts`);
  }

  getAccountDetails(accountId: string): Observable<Account> {
    return this.baseApiService.get<Account>(`accounts/${accountId}`);
  }
}