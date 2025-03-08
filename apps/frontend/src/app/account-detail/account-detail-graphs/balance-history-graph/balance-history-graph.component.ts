import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnDestroy,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import Chart from 'chart.js/auto';
import { catchError, combineLatest, EMPTY, filter, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { AccountsDataService } from '../../../shared/api/accounts-data.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ErrorDisplayComponent } from '../../../shared/components/error-display/error-display.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { BalanceHistoryEntry } from '../../../shared/models/balance-history-entry';
import { TimeRange } from '../../../shared/models/time-range';

@Component({
  selector: 'app-balance-history-graph',
  imports: [CommonModule, ErrorDisplayComponent, LoadingSpinnerComponent, CardComponent],
  templateUrl: './balance-history-graph.component.html',
  styleUrl: './balance-history-graph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceHistoryGraphComponent implements OnDestroy {
  private readonly accountsDataService: AccountsDataService = inject(AccountsDataService);

  readonly accountId: InputSignal<string> = input.required<string>();
  readonly timeRange: InputSignal<TimeRange | undefined> = input.required<TimeRange | undefined>();

  readonly loadingChanged: OutputEmitterRef<boolean> = output<boolean>();

  readonly accountId$: Observable<string> = toObservable(this.accountId);
  readonly timeRange$: Observable<TimeRange> = toObservable(this.timeRange).pipe(
    filter((timeRange): timeRange is TimeRange => timeRange !== undefined),
  );

  protected readonly chartCanvas: Signal<ElementRef<HTMLCanvasElement>> = viewChild.required('chart');

  readonly loading: WritableSignal<boolean> = signal(false);

  protected readonly entries$: Observable<Array<BalanceHistoryEntry>> = combineLatest([
    this.accountId$,
    this.timeRange$,
  ]).pipe(
    tap(() => this.loading.set(true)),
    switchMap(([accountId, timeRange]) => this.accountsDataService.getBalanceHistory(accountId, timeRange)),
    map((apiResponse) => apiResponse.data),
    tap(() => this.loading.set(false)),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    }),
  );
  protected readonly entries: Signal<Array<BalanceHistoryEntry> | undefined> = toSignal(this.entries$, {
    rejectErrors: true,
  });

  readonly loadingError: Signal<Error | undefined> = toSignal(
    this.entries$.pipe(
      switchMap(() => EMPTY),
      catchError((error: unknown) => of(error as Error)),
      tap(() => this.loading.set(false)),
    ),
  );

  protected readonly chart: WritableSignal<Chart | undefined> = signal<Chart | undefined>(undefined);

  constructor() {
    effect(() => {
      this.loadingChanged.emit(this.loading());
    });

    effect(() => {
      const canvas = this.chartCanvas();

      this.buildChart(canvas.nativeElement);
    });

    effect(() => {
      const entries = this.entries();
      const chart = this.chart();

      if (entries === undefined || chart === undefined) {
        return;
      }

      const labels = entries.map((item) => item.date);
      const balances = entries.map((item) => item.balance / 100);

      chart.data.labels = labels;
      chart.data.datasets[0].data = balances;

      chart.update();
    });
  }

  protected buildChart(canvas: HTMLCanvasElement): void {
    const color = 'white';

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Balance',
            data: [],
            backgroundColor: 'rgb(53, 201, 40)',
            borderColor: 'rgb(53, 201, 40)',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        color,
        scales: {
          x: {
            ticks: {
              color,
            },
            title: {
              color,
              display: true,
              text: 'Date',
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color,
            },
            title: {
              color,
              display: true,
              text: 'Amount',
            },
          },
        },
      },
    });

    this.chart.set(chart);
  }

  ngOnDestroy(): void {
    this.chart()?.destroy();
  }
}
