import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Account } from '../../shared/models/account';
import { MoneyPipe } from '../../shared/pipes/money.pipe';

@Component({
  selector: 'app-account-card',
  imports: [CommonModule, RouterLink, MoneyPipe],
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardComponent {
  readonly account: InputSignal<Account> = input.required<Account>();
}
