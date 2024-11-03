import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  private readonly baseApiService: BaseApiService = inject(BaseApiService);

  login(username: string, password: string): Observable<ApiResponse<string>> {
    return this.baseApiService.post<ApiResponse<string>>('auth/login', { username, password });
  }
}
