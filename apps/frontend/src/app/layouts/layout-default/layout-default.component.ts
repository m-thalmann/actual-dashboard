import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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
  readonly layoutFacade: LayoutFacadeService = inject(LayoutFacadeService);
}
