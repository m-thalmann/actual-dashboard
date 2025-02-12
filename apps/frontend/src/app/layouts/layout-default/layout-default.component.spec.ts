import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { BaseApiService } from '../../shared/api/base-api.service';
import { GeneralDataService } from '../../shared/api/general-data.service';
import { AuthService } from '../../shared/auth/auth.service';
import { LayoutFacadeService } from '../layout-facade.service';
import { LayoutDefaultComponent } from './layout-default.component';

describe('LayoutDefaultComponent', () => {
  let component: LayoutDefaultComponent;
  let fixture: ComponentFixture<LayoutDefaultComponent>;

  let mockAuthService: Partial<AuthService>;
  let mockGeneralDataService: Partial<GeneralDataService>;
  let mockLayoutFacadeService: Partial<LayoutFacadeService>;
  let mockBaseApiService: Partial<BaseApiService>;

  beforeEach(async () => {
    mockAuthService = {
      username$: new BehaviorSubject<string | null>(null),
      logout: jest.fn(),
    };

    mockGeneralDataService = {
      reload: jest.fn().mockReturnValue(of(undefined)),
    };

    mockLayoutFacadeService = {
      backButtonUrl: signal(null),
      selectedAccount: signal(undefined),
    };

    mockBaseApiService = {
      reload: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LayoutDefaultComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: GeneralDataService, useValue: mockGeneralDataService },
        { provide: LayoutFacadeService, useValue: mockLayoutFacadeService },
        { provide: BaseApiService, useValue: mockBaseApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('doReload', () => {
    it('should reload the data', async () => {
      await component.doReload();

      expect(mockGeneralDataService.reload).toHaveBeenCalled();
      expect(mockBaseApiService.reload).toHaveBeenCalled();
    });
  });

  describe('doLogout', () => {
    it('should logout the user', () => {
      component.doLogout();

      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });
});
