import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { InputFieldComponent } from '../../shared/components/input-field/input-field.component';
import { TimeRange } from '../../shared/models/time-range';
import { BalanceHistoryGraphComponent } from './balance-history-graph/balance-history-graph.component';
import { CashFlowGraphComponent } from './cash-flow-graph/cash-flow-graph.component';

@Component({
  selector: 'app-account-detail-graphs',
  imports: [CommonModule, CashFlowGraphComponent, InputFieldComponent, BalanceHistoryGraphComponent],
  templateUrl: './account-detail-graphs.component.html',
  styleUrl: './account-detail-graphs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailGraphsComponent {
  readonly accountId: InputSignal<string> = input.required<string>();

  readonly selectedTimeRange: WritableSignal<TimeRange | undefined> = signal<TimeRange | undefined>(undefined);

  readonly cashFlowGraphLoading: WritableSignal<boolean> = signal(false);
  readonly balanceHistoryGraphLoading: WritableSignal<boolean> = signal(false);

  readonly loading: Signal<boolean> = computed(() => this.cashFlowGraphLoading() || this.balanceHistoryGraphLoading());

  updateTimeRange(startDate: string, endDate: string): void {
    if (startDate.length === 0 || endDate.length === 0) {
      return;
    }

    this.selectedTimeRange.set({
      startDate,
      endDate,
    });
  }

  selectYearToDate(): void {
    const now = new Date();

    const startOfYear = `${now.getFullYear()}-01-01`;
    const today = now.toISOString().split('T')[0];

    this.updateTimeRange(startOfYear, today);
  }
}
