import { ComponentFixture, TestBed } from '@angular/core/testing';
import Chart from 'chart.js/auto';
import { of } from 'rxjs';
import { AccountsDataService } from '../../../shared/api/accounts-data.service';
import { BalanceHistoryGraphComponent } from './balance-history-graph.component';

jest.mock('chart.js/auto', () =>
  jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
    data: {
      labels: [],
      datasets: [{ data: [] }, { data: [] }],
    },
  })),
);

describe('BalanceHistoryGraphComponent', () => {
  let component: BalanceHistoryGraphComponent;
  let fixture: ComponentFixture<BalanceHistoryGraphComponent>;
  let mockAccountsDataService: Partial<AccountsDataService>;

  beforeEach(async () => {
    (Chart as unknown as jest.Mock).mockClear();

    mockAccountsDataService = {
      getBalanceHistory: jest.fn().mockReturnValue(of({ data: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [BalanceHistoryGraphComponent],
      providers: [{ provide: AccountsDataService, useValue: mockAccountsDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceHistoryGraphComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('accountId', 'account1');
    fixture.componentRef.setInput('timeRange', { startDate: '', endDate: '' });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
