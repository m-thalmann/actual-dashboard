import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AccountCardComponent } from './account-card.component';

const mockAccount = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Account',
  amount: 2000,
};

describe('AccountCardComponent', () => {
  let component: AccountCardComponent;
  let fixture: ComponentFixture<AccountCardComponent>;

  let localeId: string;
  let currency: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('account', mockAccount);

    fixture.detectChanges();

    localeId = TestBed.inject(LOCALE_ID);

    const defaultCurrencyCode = TestBed.inject(DEFAULT_CURRENCY_CODE);
    currency = getCurrencySymbol(defaultCurrencyCode, 'narrow');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the account data', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.innerHTML).toContain(mockAccount.id);
    expect(element.innerHTML).toContain(mockAccount.name);
    expect(element.innerHTML).toContain(formatCurrency(mockAccount.amount / 100, localeId, currency));
  });
});
