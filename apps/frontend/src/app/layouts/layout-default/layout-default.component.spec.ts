import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
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

  beforeEach(async () => {
    mockAuthService = {
      username$: new BehaviorSubject<string | null>(null),
      logout: jest.fn(),
    };

    mockGeneralDataService = {
      reload: jest.fn(),
    };

    mockLayoutFacadeService = {
      showBackButton: signal(false),
      selectedAccount: signal(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [LayoutDefaultComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: GeneralDataService, useValue: mockGeneralDataService },
        { provide: LayoutFacadeService, useValue: mockLayoutFacadeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
