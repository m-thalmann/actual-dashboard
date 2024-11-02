import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TransactionsDataService } from '../../shared/api/transactions-data.service';
import { AccountDetailFilterComponent } from './account-detail-filter.component';

describe('AccountDetailFilterComponent', () => {
  let component: AccountDetailFilterComponent;
  let fixture: ComponentFixture<AccountDetailFilterComponent>;

  let mockTransactionsDataService: Partial<TransactionsDataService>;

  beforeEach(async () => {
    mockTransactionsDataService = {
      getCategories: jest.fn().mockReturnValue(of({ data: ['category1', 'category2', null] })),
    };

    await TestBed.configureTestingModule({
      imports: [AccountDetailFilterComponent],
      providers: [{ provide: TransactionsDataService, useValue: mockTransactionsDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailFilterComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('accountId', 'account1');
    fixture.componentRef.setInput('currentFilters', [
      { property: 'notes', value: 'search text' },
      { property: 'category', value: 'category1' },
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories', () => {
    expect(component.categoryOptions()).toEqual([
      { value: undefined, label: 'All' },
      { value: 'category1', label: 'category1' },
      { value: 'category2', label: 'category2' },
      { value: null, label: 'No category' },
    ]);

    expect(mockTransactionsDataService.getCategories).toHaveBeenCalledWith('account1');
  });
});
