import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../app.config';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = inject(API_BASE_URL);

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${url}`);
  }
}
