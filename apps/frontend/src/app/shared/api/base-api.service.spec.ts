import { HttpParams, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FILTER_TYPES } from '@app/shared-types';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../app.config';
import { BaseApiService } from './base-api.service';

const MOCK_API_BASE_URL = 'http://localhost:3000';

@Injectable()
class BaseApiServiceTestClass extends BaseApiService {
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

  override mergeParams(...args: Parameters<BaseApiService['mergeParams']>): ReturnType<BaseApiService['mergeParams']> {
    return super.mergeParams(...args);
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

  describe('get', () => {
    it('should make a GET request with the provided URL', async () => {
      const url = 'test';
      const response = { data: 'test' };

      const resultPromise = firstValueFrom(service.get(url));

      const req = httpTesting.expectOne(`${MOCK_API_BASE_URL}/${url}`);
      expect(req.request.method).toBe('GET');

      req.flush(response);
      const result = await resultPromise;

      expect(result).toEqual(response);
    });

    it('should make a GET request with the provided URL and pagination params', async () => {
      service.generatePaginationParams = jest
        .fn()
        .mockImplementation(() => new HttpParams().append('page', '1').append('page-size', '10'));

      const generatePaginationParamsSpy = jest.spyOn(service, 'generatePaginationParams');

      const url = 'test';
      const response = { data: 'test' };
      const pagination = { page: 1, pageSize: 10 };

      const resultPromise = firstValueFrom(service.get(url, { pagination }));

      const req = httpTesting.expectOne(`${MOCK_API_BASE_URL}/${url}?page=1&page-size=10`);
      expect(req.request.method).toBe('GET');

      req.flush(response);
      const result = await resultPromise;

      expect(result).toEqual(response);
      expect(generatePaginationParamsSpy).toHaveBeenCalledWith(pagination);
    });

    it('should make a GET request with the provided URL and filter params', async () => {
      service.generateFilterParams = jest
        .fn()
        .mockImplementation(() => new HttpParams().append('filter[name][like]', 'test'));

      const generateFilterParamsSpy = jest.spyOn(service, 'generateFilterParams');

      const url = 'test';
      const response = { data: 'test' };
      const filters = [{ property: 'name', type: FILTER_TYPES.LIKE, value: 'test' }];

      const resultPromise = firstValueFrom(service.get(url, { filters }));

      const req = httpTesting.expectOne(`${MOCK_API_BASE_URL}/${url}?${encodeURI('filter[name][like]=test')}`);
      expect(req.request.method).toBe('GET');

      req.flush(response);
      const result = await resultPromise;

      expect(result).toEqual(response);
      expect(generateFilterParamsSpy).toHaveBeenCalledWith(filters);
    });

    it('should make a GET request with the provided URL, pagination and filter params', async () => {
      service.generatePaginationParams = jest
        .fn()
        .mockImplementation(() => new HttpParams().append('page', '1').append('page-size', '10'));
      service.generateFilterParams = jest
        .fn()
        .mockImplementation(() => new HttpParams().append('filter[name][like]', 'test'));

      const generatePaginationParamsSpy = jest.spyOn(service, 'generatePaginationParams');
      const generateFilterParamsSpy = jest.spyOn(service, 'generateFilterParams');

      const url = 'test';
      const response = { data: 'test' };
      const pagination = { page: 1, pageSize: 10 };
      const filters = [{ property: 'name', type: FILTER_TYPES.LIKE, value: 'test' }];

      const resultPromise = firstValueFrom(service.get(url, { pagination, filters }));

      const req = httpTesting.expectOne(
        `${MOCK_API_BASE_URL}/${url}?page=1&page-size=10&${encodeURI('filter[name][like]=test')}`,
      );
      expect(req.request.method).toBe('GET');

      req.flush(response);
      const result = await resultPromise;

      expect(result).toEqual(response);
      expect(generatePaginationParamsSpy).toHaveBeenCalledWith(pagination);
      expect(generateFilterParamsSpy).toHaveBeenCalledWith(filters);
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

    it('should return HttpParams with filter options', () => {
      const filters = [
        { property: 'name', type: FILTER_TYPES.LIKE, value: 'test' },
        { property: 'id', type: FILTER_TYPES.EQUAL, value: '1' },
      ];
      const expectedString = encodeURI('filter[name][like]=test&filter[id][eq]=1');

      const result = service.generateFilterParams(filters);

      expect(result?.toString()).toEqual(expectedString);
    });
  });

  describe('generatePaginationParams', () => {
    it('should return null when pagination is undefined', () => {
      const result = service.generatePaginationParams(undefined);

      expect(result).toBeNull();
    });

    it('should return HttpParams with page and page-size', () => {
      const pagination = { page: 1, pageSize: 10 };
      const expectedString = encodeURI('page=1&page-size=10');

      const result = service.generatePaginationParams(pagination);

      expect(result?.toString()).toEqual(expectedString);
    });

    it('should return HttpParams with default page size', () => {
      const pagination = { page: 1 };
      const expectedString = encodeURI(`page=1&page-size=${BaseApiService.DEFAULT_PAGE_SIZE}`);

      const result = service.generatePaginationParams(pagination);

      expect(result?.toString()).toEqual(expectedString);
    });
  });

  describe('mergeParams', () => {
    it('should return HttpParams with merged values', () => {
      const params1 = new HttpParams().appendAll({
        param1: 'value1',
        param2: 'value2',
      });

      const params2 = new HttpParams().appendAll({
        param3: 'value3',
        param4: 'value4',
      });

      const expectedString = encodeURI('param1=value1&param2=value2&param3=value3&param4=value4');

      const result = service.mergeParams(params1, params2);

      expect(result?.toString()).toEqual(expectedString);
    });

    it('should ignore null HttpParams', () => {
      const params1 = new HttpParams().appendAll({
        param1: 'value1',
        param2: 'value2',
      });

      const params2 = null;

      const expectedString = encodeURI('param1=value1&param2=value2');

      const result = service.mergeParams(params1, params2);

      expect(result?.toString()).toEqual(expectedString);
    });

    it('should return undefined when no HttpParams are provided', () => {
      const result = service.mergeParams();

      expect(result).toBeUndefined();
    });

    it('should return undefined when only null HttpParams are provided', () => {
      const result = service.mergeParams(null, null);

      expect(result).toBeUndefined();
    });
  });
});
