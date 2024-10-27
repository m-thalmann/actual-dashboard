import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AccountsDataService } from '../shared/api/accounts-data.service';
import { TransactionsDataService } from '../shared/api/transactions-data.service';
import { AccountDetailComponent } from './account-detail.component';

const mockAccount = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Account',
  amount: 2000,
};

describe('AccountDetailComponent', () => {
  let component: AccountDetailComponent;
  let fixture: ComponentFixture<AccountDetailComponent>;

  let mockAccountsDataService: Partial<AccountsDataService>;
  let mockTransactionsDataService: Partial<TransactionsDataService>;

  beforeEach(async () => {
    mockAccountsDataService = {
      getAccountDetails: jest.fn().mockReturnValue(of({ data: mockAccount })),
    };

    mockTransactionsDataService = {
      getTransactions: jest
        .fn()
        .mockReturnValue(of({ data: [], meta: { currentPage: 1, lastPage: 1, total: 1, perPage: 20 } })),
    };

    await TestBed.configureTestingModule({
      imports: [AccountDetailComponent],
      providers: [
        { provide: AccountsDataService, useValue: mockAccountsDataService },
        { provide: TransactionsDataService, useValue: mockTransactionsDataService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
