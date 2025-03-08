import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AccountsDataService } from '../../shared/api/accounts-data.service';
import { TransactionsDataService } from '../../shared/api/transactions-data.service';
import { AccountDetailGraphsComponent } from './account-detail-graphs.component';

describe('AccountDetailGraphsComponent', () => {
  let component: AccountDetailGraphsComponent;
  let fixture: ComponentFixture<AccountDetailGraphsComponent>;
  let mockTransactionsDataService: Partial<TransactionsDataService>;
  let mockAccountsDataService: Partial<AccountsDataService>;

  beforeEach(async () => {
    mockTransactionsDataService = {
      getCashFlow: jest.fn().mockReturnValue(of({ data: [] })),
    };
    mockAccountsDataService = {
      getBalanceHistory: jest.fn().mockReturnValue(of({ data: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [AccountDetailGraphsComponent],
      providers: [
        { provide: TransactionsDataService, useValue: mockTransactionsDataService },
        { provide: AccountsDataService, useValue: mockAccountsDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailGraphsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('accountId', 'account1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
