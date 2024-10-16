import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000'; // TODO: move to environment file

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  private readonly http: HttpClient = inject(HttpClient);

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${API_URL}/${url}`);
  }
}
