import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FilterParams } from '@app/shared-types';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../app.config';
import { PaginationConfig } from '../models/pagination-config';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  static readonly DEFAULT_PAGE_SIZE: number = 20;

  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = inject(API_BASE_URL);

  get<T>(url: string, options?: { pagination?: PaginationConfig; filters?: Array<FilterParams> }): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${url}`, {
      params: this.mergeParams(
        this.generatePaginationParams(options?.pagination),
        this.generateFilterParams(options?.filters),
      ),
    });
  }

  private generateFilterParams(filters?: Array<FilterParams>): HttpParams | null {
    if (!filters || filters.length === 0) {
      return null;
    }

    return filters.reduce((params, filterOption) => {
      const filter = `filter[${filterOption.property}][${filterOption.type}]`;
      const value = filterOption.value ?? '';

      return params.append(filter, value.toString());
    }, new HttpParams());
  }

  private generatePaginationParams(pagination?: PaginationConfig): HttpParams | null {
    if (pagination === undefined) {
      return null;
    }

    const pageSize = pagination.pageSize ?? BaseApiService.DEFAULT_PAGE_SIZE;
    const page = pagination.page;

    return new HttpParams().append('page', page).append('page-size', pageSize);
  }

  private mergeParams(...httpParams: Array<HttpParams | null>): HttpParams | undefined {
    const mergedParams: Record<string, Array<string>> = {};

    for (const params of httpParams) {
      if (params) {
        for (const param of params.keys()) {
          const value = params.getAll(param);
          if (value !== null) {
            mergedParams[param] = value;
          }
        }
      }
    }

    if (Object.keys(mergedParams).length === 0) {
      return undefined;
    }

    return new HttpParams().appendAll(mergedParams);
  }
}
