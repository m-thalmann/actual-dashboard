import { Route } from '@angular/router';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountsOverviewComponent } from './accounts-overview/accounts-overview.component';
import { LayoutDefaultComponent } from './layouts/layout-default/layout-default.component';
import { authGuard } from './shared/auth/auth.guard';
import { guestGuard } from './shared/auth/guest.guard';

export const appRoutes: Array<Route> = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/accounts',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: async () => await import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [authGuard],
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
