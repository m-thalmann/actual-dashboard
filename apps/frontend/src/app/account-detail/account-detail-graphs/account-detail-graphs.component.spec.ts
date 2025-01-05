import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TransactionsDataService } from '../../shared/api/transactions-data.service';
import { AccountDetailGraphsComponent } from './account-detail-graphs.component';

describe('AccountDetailGraphsComponent', () => {
  let component: AccountDetailGraphsComponent;
  let fixture: ComponentFixture<AccountDetailGraphsComponent>;
  let mockTransactionsDataService: Partial<TransactionsDataService>;

  beforeEach(async () => {
    mockTransactionsDataService = {
      getCashFlow: jest.fn().mockReturnValue(of({ data: [] })),
    };
    await TestBed.configureTestingModule({
      imports: [AccountDetailGraphsComponent],
      providers: [{ provide: TransactionsDataService, useValue: mockTransactionsDataService }],
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
