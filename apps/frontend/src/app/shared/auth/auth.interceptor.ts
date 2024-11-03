import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../../app.config';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const apiUrl = inject(API_BASE_URL);
  const authService = inject(AuthService);

  if (!request.url.startsWith(apiUrl)) {
    return next(request);
  }

  const token = authService.getToken();
  let nextRequest = request;

  if (token !== null) {
    nextRequest = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(nextRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized.valueOf()) {
        authService.logout();
      }
      return throwError(() => error);
    }),
  );
};
