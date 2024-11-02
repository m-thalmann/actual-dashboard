import { Route } from '@angular/router';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountsOverviewComponent } from './accounts-overview/accounts-overview.component';
import { LayoutDefaultComponent } from './layouts/layout-default/layout-default.component';

export const appRoutes: Array<Route> = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/accounts',
  },
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      {
        path: 'accounts',
        component: AccountsOverviewComponent,
      },
      {
        path: 'accounts/:accountId',
        component: AccountDetailComponent,
      },
    ],
  },
];
