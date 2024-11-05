import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { LayoutFacadeService } from '../layout-facade.service';

@Component({
  selector: 'app-layout-default',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './layout-default.component.html',
  styleUrl: './layout-default.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutDefaultComponent {
  protected readonly authService: AuthService = inject(AuthService);
  readonly layoutFacade: LayoutFacadeService = inject(LayoutFacadeService);

  readonly username: Signal<string | null> = toSignal(this.authService.username$, { requireSync: true });

  doLogout(): void {
    this.authService.logout();
  }
}
