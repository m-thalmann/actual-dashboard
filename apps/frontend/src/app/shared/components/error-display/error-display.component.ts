import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  InputSignal,
  Signal,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDisplayComponent {
  readonly error: InputSignal<Error | undefined> = input.required<Error | undefined>();

  readonly notFoundMessageTemplate: Signal<TemplateRef<unknown> | undefined> =
    contentChild<TemplateRef<unknown>>('notFoundMessage');
  readonly errorMessageTemplate: Signal<TemplateRef<unknown> | undefined> =
    contentChild<TemplateRef<unknown>>('errorMessage');

  readonly type: Signal<'error' | 'not-found'> = computed(() => {
    const error = this.error();

    if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.NotFound.valueOf()) {
      return 'not-found';
    }

    return 'error';
  });

  readonly message: Signal<string | undefined> = computed(() => {
    const error = this.error();

    if (error instanceof HttpErrorResponse) {
      if ('message' in error.error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return String(error.error.message);
      }
    }

    return error?.message ?? 'No additional information available.';
  });
}
