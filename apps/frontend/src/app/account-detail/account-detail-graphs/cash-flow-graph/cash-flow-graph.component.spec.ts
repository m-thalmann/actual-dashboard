import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TransactionsDataService } from '../../../shared/api/transactions-data.service';
import { CashFlowGraphComponent } from './cash-flow-graph.component';

describe('CashFlowGraphComponent', () => {
  let component: CashFlowGraphComponent;
  let fixture: ComponentFixture<CashFlowGraphComponent>;
  let mockTransactionsDataService: Partial<TransactionsDataService>;

  beforeEach(async () => {
    mockTransactionsDataService = {
      getCashFlow: jest.fn().mockReturnValue(of({ data: [] })),
    };
    await TestBed.configureTestingModule({
      imports: [CashFlowGraphComponent],
      providers: [{ provide: TransactionsDataService, useValue: mockTransactionsDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CashFlowGraphComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('accountId', 'account1');
    fixture.componentRef.setInput('timeRange', { startDate: '', endDate: '' });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
