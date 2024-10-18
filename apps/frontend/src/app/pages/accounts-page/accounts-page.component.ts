import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accounts-page.component.html',
  styleUrl: './accounts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsPageComponent {}
