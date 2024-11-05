import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthDataService } from '../shared/api/auth-data.service';
import { AuthService } from '../shared/auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthDataService: Partial<AuthDataService>;
  let mockAuthService: Partial<AuthService>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockAuthDataService = {
      login: jest.fn(),
    };

    mockAuthService = {
      login: jest.fn(),
    };

    mockRouter = {
      navigateByUrl: jest.fn(),
    };

    mockActivatedRoute = {
      snapshot: {
        // @ts-expect-error type mismatch
        queryParamMap: {
          get: jest.fn(),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthDataService, useValue: mockAuthDataService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('doLogin', () => {
    it('should login the user and redirect to the home route', async () => {
      const username = 'username';
      const password = 'password';

      const expectedToken = 'token';

      (mockAuthDataService.login as jest.Mock).mockReturnValue(of({ data: expectedToken }));

      fixture.componentRef.setInput('username', username);
      fixture.componentRef.setInput('password', password);

      await component.doLogin();

      expect(component.error()).toBe(false);
      expect(mockAuthDataService.login).toHaveBeenCalledWith(username, password);
      expect(mockAuthService.login).toHaveBeenCalledWith(username, expectedToken);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should login and redirect to the redirect url', async () => {
      const expectedRedirectUrl = '/redirect-url';

      (mockAuthDataService.login as jest.Mock).mockReturnValue(of('token'));

      fixture.componentRef.setInput('username', 'username');
      fixture.componentRef.setInput('password', 'password');

      (mockActivatedRoute.snapshot?.queryParamMap.get as jest.Mock).mockReturnValue(expectedRedirectUrl);

      await component.doLogin();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(expectedRedirectUrl);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockActivatedRoute.snapshot?.queryParamMap.get).toHaveBeenCalledWith('redirect-url');
    });

    it('should set error to true if login fails', async () => {
      (mockAuthDataService.login as jest.Mock).mockReturnValue(throwError(() => new Error()));

      fixture.componentRef.setInput('username', 'username');
      fixture.componentRef.setInput('password', 'password');

      await component.doLogin();

      expect(component.error()).toBe(true);
      expect(mockAuthService.login).not.toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});
