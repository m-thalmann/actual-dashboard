import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.token$.pipe(
    map((token) => {
      if (token !== null) {
        return true;
      }

      return router.createUrlTree(['/login'], {
        queryParams: {
          'redirect-url': state.url,
        },
      });
    }),
  );
};
