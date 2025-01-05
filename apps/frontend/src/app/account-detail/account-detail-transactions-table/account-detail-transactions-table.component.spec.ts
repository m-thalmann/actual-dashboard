import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TransactionsDataService } from '../../shared/api/transactions-data.service';
import { AccountDetailTransactionsTableComponent } from './account-detail-transactions-table.component';

describe('AccountDetailTransactionsTableComponent', () => {
  let component: AccountDetailTransactionsTableComponent;
  let fixture: ComponentFixture<AccountDetailTransactionsTableComponent>;
  let mockTransactionsDataService: Partial<TransactionsDataService>;

  beforeEach(async () => {
    mockTransactionsDataService = {
      getCategories: jest.fn().mockReturnValue(of({ data: ['category1', 'category2', null] })),
    };
    await TestBed.configureTestingModule({
      imports: [AccountDetailTransactionsTableComponent],
      providers: [provideRouter([]), { provide: TransactionsDataService, useValue: mockTransactionsDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailTransactionsTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('accountId', 'account1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
