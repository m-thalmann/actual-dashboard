import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FilterParams } from '@app/shared-types';
import { catchError, EMPTY, filter, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { TransactionsDataService } from '../../shared/api/transactions-data.service';
import { InputFieldComponent } from '../../shared/components/input-field/input-field.component';
import { SelectFieldComponent, SelectFieldOption } from '../../shared/components/select-field/select-field.component';

@Component({
  selector: 'app-account-detail-filter',
  imports: [CommonModule, InputFieldComponent, SelectFieldComponent],
  templateUrl: './account-detail-filter.component.html',
  styleUrl: './account-detail-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailFilterComponent {
  private readonly transactionsDataService: TransactionsDataService = inject(TransactionsDataService);

  readonly accountId: InputSignal<string | undefined> = input.required<string | undefined>();
  private readonly accountId$: Observable<string | undefined> = toObservable(this.accountId);

  readonly currentFilters: InputSignal<Array<FilterParams> | undefined> = input.required<
    Array<FilterParams> | undefined
  >();

  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  readonly search: OutputEmitterRef<string | null> = output<string | null>();
  readonly categoryChange: OutputEmitterRef<string | null> = output<string | null>();

  readonly categoriesLoading: WritableSignal<boolean> = signal(false);

  protected readonly categories$: Observable<Array<string | null>> = this.accountId$.pipe(
    filter((id) => id !== undefined),
    tap(() => this.categoriesLoading.set(true)),
    switchMap((id) => this.transactionsDataService.getCategories(id)),
    map((loadedCategories) => loadedCategories.data),
    tap(() => this.categoriesLoading.set(false)),
    shareReplay({ refCount: true }),
  );

  readonly categoriesLoadingError: Signal<Error | undefined> = toSignal(
    this.categories$.pipe(
      switchMap(() => EMPTY),
      catchError((error: unknown) => of(error as Error)),
      tap(() => this.categoriesLoading.set(false)),
    ),
  );

  readonly categoryOptions: Signal<Array<SelectFieldOption<string | null | undefined>>> = toSignal(
    this.categories$.pipe(
      map((categories) => {
        const options = categories.map<SelectFieldOption<string | null | undefined>>((category) => ({
          value: category,
          label: category ?? 'No category',
        }));

        options.unshift({ value: undefined, label: 'All' });

        return options;
      }),
      catchError(() => of([])),
    ),
    { initialValue: [] },
  );

  readonly filters: Signal<{ search: string; category: string | null | undefined }> = computed(() => {
    const currentFilters = this.currentFilters();

    const search = currentFilters?.find((foundFilter) => foundFilter.property === 'notes')?.value ?? '';
    let category = currentFilters?.find((foundFilter) => foundFilter.property === 'category')?.value;

    if (category?.length === 0) {
      category = null;
    }

    return { search, category };
  });

  doSearch(value: string): void {
    const searchValue = value === '' ? null : value;
    this.search.emit(searchValue);
  }

  changeCategory(category: string | null | undefined): void {
    let filteredCategory: string | null = null;

    if (category?.length === 0) {
      filteredCategory = null;
    } else if (category === null) {
      filteredCategory = '';
    } else if (category !== undefined) {
      filteredCategory = category;
    }

    this.categoryChange.emit(filteredCategory);
  }
}
