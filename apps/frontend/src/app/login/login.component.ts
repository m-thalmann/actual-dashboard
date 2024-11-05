import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model, ModelSignal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AuthDataService } from '../shared/api/auth-data.service';
import { AuthService } from '../shared/auth/auth.service';
import { InputFieldComponent } from '../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, InputFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authDataService: AuthDataService = inject(AuthDataService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  readonly username: ModelSignal<string> = model('');
  readonly password: ModelSignal<string> = model('');

  readonly loading: WritableSignal<boolean> = signal(false);
  readonly error: WritableSignal<boolean> = signal(false);

  async doLogin(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    const result = await firstValueFrom(
      this.authDataService.login(this.username(), this.password()).pipe(catchError(() => of(null))),
    );

    this.loading.set(false);

    if (result === null) {
      this.error.set(true);
      return;
    }

    this.authService.login(this.username(), result.data);

    const redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirect-url') ?? '/';
    this.router.navigateByUrl(redirectUrl);
  }
}
