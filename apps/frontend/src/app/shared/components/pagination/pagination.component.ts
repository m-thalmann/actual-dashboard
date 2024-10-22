import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly page: InputSignal<number> = input.required<number>();
  readonly totalPages: InputSignal<number> = input.required<number>();

  readonly prevPage: OutputEmitterRef<void> = output<void>();
  readonly nextPage: OutputEmitterRef<void> = output<void>();
}
