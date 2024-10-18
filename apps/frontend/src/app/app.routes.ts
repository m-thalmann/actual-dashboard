import { Route } from '@angular/router';
import { AccountsPageComponent } from './pages/accounts-page/accounts-page.component';

export const appRoutes: Array<Route> = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/accounts',
  },
  {
    path: 'accounts',
    component: AccountsPageComponent,
  },
];
