import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account';
import { ApiResponse } from '../models/api-response';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class AccountsDataService {
  private readonly baseApiService: BaseApiService = inject(BaseApiService);

  getAccounts(): Observable<ApiResponse<Array<Account>>> {
    return this.baseApiService.get<ApiResponse<Array<Account>>>(`accounts`);
  }

  getAccountDetails(accountId: string): Observable<ApiResponse<Account | null>> {
    return this.baseApiService.get<ApiResponse<Account>>(`accounts/${accountId}`);
  }
}
