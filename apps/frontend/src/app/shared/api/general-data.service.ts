import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class GeneralDataService {
  private readonly baseApiService: BaseApiService = inject(BaseApiService);

  reload(): Observable<void> {
    return this.baseApiService.post<void>(`general/reload`, {});
  }
}
