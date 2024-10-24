import { Route } from '@angular/router';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountsOverviewComponent } from './accounts-overview/accounts-overview.component';

export const appRoutes: Array<Route> = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/accounts',
  },
  {
    path: 'accounts',
    component: AccountsOverviewComponent,
  },
  {
    path: 'accounts/:accountId',
    component: AccountDetailComponent,
  },
];
