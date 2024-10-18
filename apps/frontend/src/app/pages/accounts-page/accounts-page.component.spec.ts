import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AccountsDataService } from '../../core/api/accounts-data.service';
import { AccountsPageComponent } from './accounts-page.component';

describe('AccountsPageComponent', () => {
  let component: AccountsPageComponent;
  let fixture: ComponentFixture<AccountsPageComponent>;

  let mockAccountsDataService: Partial<AccountsDataService>;

  beforeEach(async () => {
    mockAccountsDataService = {
      getAccounts: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [AccountsPageComponent],
      providers: [{ provide: AccountsDataService, useValue: mockAccountsDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
