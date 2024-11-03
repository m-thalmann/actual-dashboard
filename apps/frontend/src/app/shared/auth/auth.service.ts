import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

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

  protected readonly authData$: BehaviorSubject<AuthData | null> = new BehaviorSubject<AuthData | null>(null);
  readonly token$: Observable<string | null> = this.authData$.pipe(
    map((data) => data?.token ?? null),
    distinctUntilChanged(),
  );
  readonly username$: Observable<string | null> = this.authData$.pipe(
    map((data) => data?.username ?? null),
    distinctUntilChanged(),
  );

  constructor() {
    this.reloadData();
  }

  getToken(): string | null {
    return this.authData$.getValue()?.token ?? null;
  }

  getUsername(): string | null {
    return this.authData$.getValue()?.username ?? null;
  }

  login(username: string, token: string): void {
    localStorage.setItem(AuthService.USERNAME_STORAGE_KEY, username);
    localStorage.setItem(AuthService.TOKEN_STORAGE_KEY, token);
    this.reloadData();
  }

  logout(): void {
    localStorage.removeItem(AuthService.TOKEN_STORAGE_KEY);
    localStorage.removeItem(AuthService.USERNAME_STORAGE_KEY);
    this.reloadData();
    this.router.navigateByUrl('/login');
  }

  protected reloadData(): void {
    const token = localStorage.getItem(AuthService.TOKEN_STORAGE_KEY);
    const username = localStorage.getItem(AuthService.USERNAME_STORAGE_KEY);
    if (token === null || username === null) {
      this.authData$.next(null);
      return;
    }

    this.authData$.next({
      token,
      username,
    });
  }
}
