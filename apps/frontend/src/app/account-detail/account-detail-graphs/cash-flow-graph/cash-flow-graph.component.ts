import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import Chart from 'chart.js/auto';
import { combineLatest, filter, map, Observable, shareReplay, switchMap } from 'rxjs';
import { TransactionsDataService } from '../../../shared/api/transactions-data.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CashFlowEntry } from '../../../shared/models/cash-flow-entry';
import { TimeRange } from '../../../shared/models/time-range';

@Component({
  selector: 'app-cash-flow-graph',
  imports: [CommonModule, CardComponent],
  templateUrl: './cash-flow-graph.component.html',
  styleUrl: './cash-flow-graph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowGraphComponent {
  private readonly transactionDataService: TransactionsDataService = inject(TransactionsDataService);

  readonly accountId: InputSignal<string> = input.required<string>();
  readonly timeRange: InputSignal<TimeRange> = input.required<TimeRange>();
  readonly accountId$: Observable<string> = toObservable(this.accountId);
  readonly timeRange$: Observable<TimeRange> = toObservable(this.timeRange);
  //TODO: no time range selected handling

  protected readonly canvasGraph: Signal<ElementRef<HTMLCanvasElement>> = viewChild.required('graph');

  //TODO: add error handling
  //TODO: add loading
  protected readonly entries$: Observable<Array<CashFlowEntry>> = combineLatest([
    this.accountId$,
    this.timeRange$,
  ]).pipe(
    filter(([, timeRange]) => timeRange.endDate.length > 0 && timeRange.startDate.length > 0),
    switchMap(([accountId, timeRange]) => this.transactionDataService.getCashFlow(accountId, timeRange)),
    map((apiResponse) => apiResponse.data),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    }),
  );
  protected readonly entries: Signal<Array<CashFlowEntry> | undefined> = toSignal(this.entries$);

  protected readonly graph: WritableSignal<Chart | undefined> = signal<Chart | undefined>(undefined);

  constructor() {
    effect(() => {
      const canvas = this.canvasGraph();

      this.buildGraph(canvas.nativeElement);
    });
    effect(() => {
      const entries = this.entries();
      const graph = this.graph();

      if (entries === undefined || graph === undefined) {
        return;
      }

      const labels = entries.map((item) => item.date);
      const deposits = entries.map((item) => item.deposit / 100);
      const payments = entries.map((item) => item.payment / 100);

      graph.data.labels = labels;
      graph.data.datasets[0].data = deposits;
      graph.data.datasets[1].data = payments;

      graph.update();
    });
  }

  protected buildGraph(canvas: HTMLCanvasElement): void {
    const color = 'white';

    const graph = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Deposits',
            data: [],
            backgroundColor: 'rgb(53, 201, 40)',
            borderWidth: 1,
          },
          {
            label: 'Payments',
            data: [],
            backgroundColor: 'rgb(250, 85, 85)',
            borderWidth: 1,
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

    this.graph.set(graph);
  }
}
