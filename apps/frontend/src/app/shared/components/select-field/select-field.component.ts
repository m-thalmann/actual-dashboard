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
import { FormsModule, SelectControlValueAccessor } from '@angular/forms';

export interface SelectFieldOption<T> {
  label: string;
  value: T;
}

type TrackByFn<T> = (value: T) => unknown;

@Component({
  selector: 'app-select-field',
  imports: [CommonModule, FormsModule],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFieldComponent<T> {
  readonly value: ModelSignal<T> = model.required<T>();
  readonly options: InputSignal<Array<SelectFieldOption<T>>> = input.required<Array<SelectFieldOption<T>>>();
  readonly label: InputSignal<string> = input.required();

  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  readonly trackByFn: InputSignal<TrackByFn<T> | undefined> = input();

  compareWith: SelectControlValueAccessor['compareWith'] = (a: T, b: T) => this.trackBy(a) === this.trackBy(b);

  trackBy(value: T): unknown {
    const fn = this.trackByFn() ?? ((a) => a);

    return fn(value);
  }
}
