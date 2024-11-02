import { TestBed } from '@angular/core/testing';

import { Account } from '../shared/models/account';
import { LayoutFacadeService } from './layout-facade.service';

describe('LayoutFacadeService', () => {
  let service: LayoutFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set selected account', () => {
    const account: Account = { id: '1', name: 'Account 1', amount: 1000 };
    service.setSelectedAccount(account);

    expect(service.selectedAccount()).toEqual(account);
  });

  it('should set selected account to undefined', () => {
    service.setSelectedAccount(undefined);

    expect(service.selectedAccount()).toBeUndefined();
  });
});
