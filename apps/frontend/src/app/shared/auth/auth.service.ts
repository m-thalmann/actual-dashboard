import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, map, Observable, skip, tap } from 'rxjs';

export interface AuthData {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static readonly TOKEN_STORAGE_KEY: string = 'app-auth-token';
  static readonly USERNAME_STORAGE_KEY: string = 'app-auth-username';

  private readonly router: Router = inject(Router);

  protected readonly authData$: BehaviorSubject<AuthData | null>;
  readonly token$: Observable<string | null>;
  readonly username$: Observable<string | null>;

  constructor() {
    const token = localStorage.getItem(AuthService.TOKEN_STORAGE_KEY);
    const username = localStorage.getItem(AuthService.USERNAME_STORAGE_KEY);

    const authData = token && username ? { token, username } : null;

    this.authData$ = new BehaviorSubject<AuthData | null>(authData);

    this.token$ = this.authData$.pipe(
      map((data) => data?.token ?? null),
      distinctUntilChanged(),
    );
    this.username$ = this.authData$.pipe(
      map((data) => data?.username ?? null),
      distinctUntilChanged(),
    );

    this.authData$
      .pipe(
        skip(1),
        tap((data) => {
          if (data === null) {
            localStorage.removeItem(AuthService.TOKEN_STORAGE_KEY);
            localStorage.removeItem(AuthService.USERNAME_STORAGE_KEY);
            return;
          }

          localStorage.setItem(AuthService.TOKEN_STORAGE_KEY, data.token);
          localStorage.setItem(AuthService.USERNAME_STORAGE_KEY, data.username);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  getToken(): string | null {
    return this.authData$.getValue()?.token ?? null;
  }

  getUsername(): string | null {
    return this.authData$.getValue()?.username ?? null;
  }

  login(username: string, token: string): void {
    this.authData$.next({
      token,
      username,
    });
  }

  logout(): void {
    this.authData$.next(null);
    this.router.navigateByUrl('/login');
  }
}
