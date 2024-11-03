import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FilterParams } from '@app/shared-types';
import { filter, first, map, Observable, shareReplay } from 'rxjs';
import { API_BASE_URL } from '../../app.config';
import { PaginationConfig } from '../models/pagination-config';

export interface RequestOptions {
  pagination?: PaginationConfig;
  filters?: Array<FilterParams>;
}

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  static readonly DEFAULT_PAGE_SIZE: number = 20;

  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = inject(API_BASE_URL);

  get httpHeaders(): Record<string, Array<string> | string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  protected request<T>(request: HttpRequest<unknown>, options?: RequestOptions): Observable<T> {
    const headers = this.httpHeaders;

    const params = {
      ...this.generatePaginationParams(options?.pagination),
      ...this.generateFilterParams(options?.filters),
    };

    const finalRequest = request.clone({
      url: `${this.apiUrl}/${request.url}`,
      setParams: params,
      setHeaders: headers,
    });

    return this.http.request<T>(finalRequest).pipe(
      shareReplay({ refCount: true }),
      filter((response): response is HttpResponse<T> => response instanceof HttpResponse),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map((response: HttpResponse<T>) => response.body!),
      first(),
    );
  }

  get<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.request<T>(new HttpRequest('GET', url), options);
  }

  post<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.request<T>(new HttpRequest('POST', url, body), options);
  }

  protected generateFilterParams(filters?: Array<FilterParams>): Record<string, string> | null {
    if (!filters || filters.length === 0) {
      return null;
    }

    return filters.reduce((params, filterOption) => {
      const filterKey = `filter[${filterOption.property}][${filterOption.type}]`;
      const filterValue = filterOption.value ?? '';

      return { ...params, [filterKey]: filterValue.toString() };
    }, {});
  }

  protected generatePaginationParams(pagination?: PaginationConfig): Record<string, string> | null {
    if (pagination === undefined) {
      return null;
    }

    const pageSize = pagination.pageSize ?? BaseApiService.DEFAULT_PAGE_SIZE;
    const page = pagination.page;

    return {
      page: page.toString(),
      'page-size': pageSize.toString(),
    };
  }
}
