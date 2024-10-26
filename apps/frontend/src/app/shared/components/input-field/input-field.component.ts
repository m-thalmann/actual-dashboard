import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
} from '@angular/core';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent {
  readonly value: ModelSignal<string> = model.required<string>();
  readonly type: InputSignal<string> = input('text');
  readonly label: InputSignal<string> = input.required();

  readonly clearable: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
}
