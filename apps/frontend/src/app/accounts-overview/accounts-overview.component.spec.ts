import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AccountsDataService } from '../core/api/accounts-data.service';
import { Account } from '../core/models/account';
import { AccountsOverviewComponent } from './accounts-overview.component';

const mockAccounts: Array<Account> = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Account',
    amount: 2000,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Test Account 2',
    amount: 3000,
  },
];

describe('AccountsOverviewComponent', () => {
  let component: AccountsOverviewComponent;
  let fixture: ComponentFixture<AccountsOverviewComponent>;

  let mockAccountsDataService: Partial<AccountsDataService>;

  beforeEach(async () => {
    mockAccountsDataService = {
      getAccounts: jest.fn().mockReturnValue(of({ data: mockAccounts })),
    };

    await TestBed.configureTestingModule({
      imports: [AccountsOverviewComponent],
      providers: [{ provide: AccountsDataService, useValue: mockAccountsDataService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the accounts through the data service', () => {
    expect(mockAccountsDataService.getAccounts).toHaveBeenCalled();
  });

  it('should display the accounts', () => {
    const accountCards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-account-card');

    expect(accountCards).toHaveLength(mockAccounts.length);

    accountCards.forEach((accountCard, index) => {
      const account = mockAccounts[index];

      expect(accountCard.innerHTML).toContain(account.id);
      expect(accountCard.innerHTML).toContain(account.name);
    });
  });
});
