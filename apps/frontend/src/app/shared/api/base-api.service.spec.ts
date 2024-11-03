import { HttpHeaders, HttpParams, HttpRequest, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FILTER_TYPES } from '@app/shared-types';
import { firstValueFrom, Observable, of } from 'rxjs';
import { API_BASE_URL } from '../../app.config';
import { BaseApiService, RequestOptions } from './base-api.service';

const MOCK_API_BASE_URL = 'http://localhost:3000';

@Injectable()
class BaseApiServiceTestClass extends BaseApiService {
  override request<T>(request: HttpRequest<unknown>, options?: RequestOptions): Observable<T> {
    return super.request(request, options);
  }

  override generateFilterParams(
    ...args: Parameters<BaseApiService['generateFilterParams']>
  ): ReturnType<BaseApiService['generateFilterParams']> {
    return super.generateFilterParams(...args);
  }

  override generatePaginationParams(
    ...args: Parameters<BaseApiService['generatePaginationParams']>
  ): ReturnType<BaseApiService['generatePaginationParams']> {
    return super.generatePaginationParams(...args);
  }
}

describe('BaseApiService', () => {
  let service: BaseApiServiceTestClass;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseApiServiceTestClass,
        { provide: API_BASE_URL, useValue: MOCK_API_BASE_URL },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(BaseApiServiceTestClass);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('request', () => {
    it('should make a request with the provided HttpRequest', async () => {
      const request = new HttpRequest('GET', 'test');
      const response = { data: 'test' };

      const resultPromise = firstValueFrom(service.request(request));

      const req = httpTesting.expectOne(`${MOCK_API_BASE_URL}/${request.url}`);
      expect(req.request.method).toBe('GET');

      Object.entries(service.httpHeaders).forEach(([key, value]) => {
        expect(req.request.headers.get(key)).toBe(value);
      });

      req.flush(response);
      const result = await resultPromise;

      expect(result).toEqual(response);
    });

    it('should make a request with the provided HttpRequest and pagination params', async () => {
      const generatePaginationParamsSpy = jest
        .spyOn(service, 'generatePaginationParams')
        .mockReturnValue({ page: '1', 'page-size': '10' });

      const request = new HttpRequest('GET', 'test');
      const response = { data: 'test' };
      const pagination = { page: 1, pageSize: 10 };

      const resultPromise = firstValueFrom(service.request(request, { pagination }));

      const req = httpTesting.expectOne(`${MOCK_API_BASE_URL}/${request.url}?page=1&page-size=10`);
      expect(req.request.method).toBe('GET');

      req.flush(response);
      const result = await resultPromise;

      expect(result).toEqual(response);
      expect(generatePaginationParamsSpy).toHaveBeenCalledWith(pagination);
    });

    it('should make a request with the provided HttpRequest and filter params', async () => {
      const generateFilterParamsSpy = jest
        .spyOn(service, 'generateFilterParams')
        .mockReturnValue({ 'filter[name][like]': 'test' });

      const request = new HttpRequest('GET', 'test');
      const response = { data: 'test' };
      const filters = [{ property: 'name', type: FILTER_TYPES.LIKE, value: 'test' }];

      const resultPromise = firstValueFrom(service.request(request, { filters }));

      const req = httpTesting.expectOne(`${MOCK_API_BASE_URL}/${request.url}?${encodeURI('filter[name][like]=test')}`);
      expect(req.request.method).toBe('GET');

      req.flush(response);
      const result = await resultPromise;

      expect(result).toEqual(response);
      expect(generateFilterParamsSpy).toHaveBeenCalledWith(filters);
    });

    it('should merge params and headers', async () => {
      const generatePaginationParamsSpy = jest
        .spyOn(service, 'generatePaginationParams')
        .mockReturnValue({ page: '1', 'page-size': '10' });
      const generateFilterParamsSpy = jest
        .spyOn(service, 'generateFilterParams')
        .mockReturnValue({ 'filter[name][like]': 'test' });

      const requestParams = new HttpParams().append('param1', 'value1');
      const requestHeaders = new HttpHeaders().append('header1', 'value1');

      const request = new HttpRequest('GET', 'test', { params: requestParams, headers: requestHeaders });
      const response = { data: 'test' };
      const pagination = { page: 1, pageSize: 10 };
      const filters = [{ property: 'name', type: FILTER_TYPES.LIKE, value: 'test' }];

      const resultPromise = firstValueFrom(service.request(request, { pagination, filters }));

      const req = httpTesting.expectOne(
        `${MOCK_API_BASE_URL}/${request.url}?param1=value1&page=1&page-size=10&${encodeURI('filter[name][like]=test')}`,
      );
      expect(req.request.method).toBe('GET');

      Object.entries(service.httpHeaders).forEach(([key, value]) => {
        expect(req.request.headers.get(key)).toBe(value);
      });
      requestHeaders.keys().forEach((key) => {
        expect(req.request.headers.get(key)).toBe(requestHeaders.get(key));
      });

      req.flush(response);
      const result = await resultPromise;

      expect(result).toEqual(response);
      expect(generatePaginationParamsSpy).toHaveBeenCalledWith(pagination);
      expect(generateFilterParamsSpy).toHaveBeenCalledWith(filters);
    });
  });

  describe('get', () => {
    it('should proxy the request method', async () => {
      const response = { data: 'test' };
      const requestSpy = jest.spyOn(service, 'request').mockReturnValue(of(response));

      const url = 'test';
      const options = { pagination: { page: 1, pageSize: 10 } };

      const result = await firstValueFrom(service.get<typeof response>(url, options));

      expect(result).toEqual(response);
      expect(requestSpy).toHaveBeenCalledWith(new HttpRequest('GET', url), options);
    });
  });

  describe('generateFilterParams', () => {
    it('should return null when no filters are provided', () => {
      const result = service.generateFilterParams(undefined);

      expect(result).toBeNull();
    });

    it('should return null when filters are empty', () => {
      const result = service.generateFilterParams([]);

      expect(result).toBeNull();
    });

    it('should return the filter options', () => {
      const filters = [
        { property: 'name', type: FILTER_TYPES.LIKE, value: 'test' },
        { property: 'id', type: FILTER_TYPES.EQUAL, value: '1' },
      ];
      const expectedParams = { 'filter[name][like]': 'test', 'filter[id][eq]': '1' };

      const result = service.generateFilterParams(filters);

      expect(result).toEqual(expectedParams);
    });
  });

  describe('generatePaginationParams', () => {
    it('should return null when pagination is undefined', () => {
      const result = service.generatePaginationParams(undefined);

      expect(result).toBeNull();
    });

    it('should return object with page and page-size', () => {
      const pagination = { page: 1, pageSize: 10 };
      const expectedParams = { page: '1', 'page-size': '10' };

      const result = service.generatePaginationParams(pagination);

      expect(result).toEqual(expectedParams);
    });

    it('should return object with default page size', () => {
      const pagination = { page: 1 };
      const expectedParams = { page: '1', 'page-size': BaseApiService.DEFAULT_PAGE_SIZE.toString() };

      const result = service.generatePaginationParams(pagination);

      expect(result).toEqual(expectedParams);
    });
  });
});
