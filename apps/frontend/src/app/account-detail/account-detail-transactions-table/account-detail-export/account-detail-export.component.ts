import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { InputFieldComponent } from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-account-detail-export',
  imports: [CommonModule, InputFieldComponent],
  templateUrl: './account-detail-export.component.html',
  styleUrl: './account-detail-export.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailExportComponent {
  readonly export: OutputEmitterRef<{ startDate: string; endDate: string }> = output<{
    startDate: string;
    endDate: string;
  }>();
  readonly showExportActions: WritableSignal<boolean> = signal(false);

  toggleExportActions(): void {
    this.showExportActions.update((value) => !value);
  }

  downloadExport(startDate: string, endDate: string): void {
    this.export.emit({ startDate, endDate });
  }
}
