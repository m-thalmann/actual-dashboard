import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FilterParams } from '@app/shared-types';
import { filter, first, map, Observable, shareReplay } from 'rxjs';
import { API_BASE_URL } from '../../app.config';
import { PaginationConfig } from '../models/pagination-config';

export interface RequestOptions {
  pagination?: PaginationConfig;
  filters?: Array<FilterParams>;
  queryParams?: Record<string, string>;
  contentType?: string;
}

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  static readonly DEFAULT_PAGE_SIZE: number = 20;

  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = inject(API_BASE_URL);

  protected request<T>(
    request: HttpRequest<unknown>,
    options?: RequestOptions,
    observeResponse?: boolean,
  ): Observable<HttpResponse<T> | T>;
  protected request<T>(request: HttpRequest<unknown>, options?: RequestOptions, observeResponse?: false): Observable<T>;
  protected request<T>(
    request: HttpRequest<unknown>,
    options: RequestOptions | undefined,
    observeResponse: true,
  ): Observable<HttpResponse<T>>;
  protected request<T>(
    request: HttpRequest<unknown>,
    options?: RequestOptions,
    observeResponse: boolean = false,
  ): Observable<HttpResponse<T> | T> {
    const headers = {
      'Content-Type': options?.contentType ?? 'application/json',
    };

    const params = {
      ...this.generatePaginationParams(options?.pagination),
      ...this.generateFilterParams(options?.filters),
      ...options?.queryParams,
    };

    const finalRequest = request.clone({
      url: `${this.apiUrl}/${request.url}`,
      setParams: params,
      setHeaders: headers,
      responseType: options?.contentType === undefined ? undefined : 'blob',
    });

    return this.http.request<T>(finalRequest).pipe(
      shareReplay({ refCount: true, bufferSize: 1 }),
      filter((response): response is HttpResponse<T> => response instanceof HttpResponse),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map((response: HttpResponse<T>) => (observeResponse ? response : response.body!)),
      first(),
    );
  }

  get<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.request<T>(new HttpRequest('GET', url), options);
  }

  post<T>(url: string, body: unknown, options?: RequestOptions): Observable<T>;
  post<T>(
    url: string,
    body: unknown,
    options: RequestOptions | undefined,
    observeResponse: true,
  ): Observable<HttpResponse<T>>;
  post<T>(
    url: string,
    body: unknown,
    options?: RequestOptions,
    observeResponse?: boolean,
  ): Observable<HttpResponse<T> | T> {
    return this.request<T>(new HttpRequest('POST', url, body), options, observeResponse);
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
