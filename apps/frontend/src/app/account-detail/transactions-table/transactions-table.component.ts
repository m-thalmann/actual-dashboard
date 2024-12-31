import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  InputSignalWithTransform,
} from '@angular/core';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { Transaction } from '../../shared/models/transaction';

@Component({
  selector: 'app-transactions-table',
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './transactions-table.component.html',
  styleUrl: './transactions-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent {
  readonly transactions: InputSignal<Array<Transaction>> = input.required<Array<Transaction>>();
  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
}
