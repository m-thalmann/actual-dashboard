import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { InputFieldComponent } from '../../shared/components/input-field/input-field.component';
import { CashFlowGraphComponent } from './cash-flow-graph/cash-flow-graph.component';
@Component({
  selector: 'app-account-detail-graphs',
  imports: [CommonModule, CashFlowGraphComponent, InputFieldComponent],
  templateUrl: './account-detail-graphs.component.html',
  styleUrl: './account-detail-graphs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailGraphsComponent {
  readonly accountId: InputSignal<string> = input.required<string>();
}
