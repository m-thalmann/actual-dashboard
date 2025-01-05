import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterOutlet } from '@angular/router';
import { delay, tap } from 'rxjs';
import { GeneralDataService } from '../../shared/api/general-data.service';
import { AuthService } from '../../shared/auth/auth.service';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { LayoutFacadeService } from '../layout-facade.service';

export const RELOAD_ANIMATION_DURATION = 250;

@Component({
  selector: 'app-layout-default',
  imports: [CommonModule, RouterOutlet, RouterLink, MoneyPipe],
  templateUrl: './layout-default.component.html',
  styleUrl: './layout-default.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutDefaultComponent {
  protected readonly authService: AuthService = inject(AuthService);
  protected readonly generalDataService: GeneralDataService = inject(GeneralDataService);
  readonly layoutFacade: LayoutFacadeService = inject(LayoutFacadeService);

  readonly username: Signal<string | null> = toSignal(this.authService.username$, { requireSync: true });

  readonly reloading: WritableSignal<boolean> = signal(false);

  doReload(): void {
    this.reloading.set(true);

    this.generalDataService
      .reload()
      .pipe(
        delay(RELOAD_ANIMATION_DURATION),
        tap(() => this.reloading.set(false)),
      )
      .subscribe();
  }

  doLogout(): void {
    this.authService.logout();
  }
}
