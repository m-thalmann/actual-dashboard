import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model, ModelSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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

  async doLogin(): Promise<void> {
    const result = await firstValueFrom(this.authDataService.login(this.username(), this.password()));
    this.authService.login(this.username(), result.data);

    const redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirect-url') ?? '/';
    this.router.navigateByUrl(redirectUrl);
  }
}
