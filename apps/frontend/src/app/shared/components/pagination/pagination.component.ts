import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  InputSignalWithTransform,
  output,
  OutputEmitterRef,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly page: InputSignal<number> = input.required<number>();
  readonly totalPages: InputSignal<number> = input.required<number>();
  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  readonly prevPage: OutputEmitterRef<void> = output();
  readonly nextPage: OutputEmitterRef<void> = output();
}
