import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountDetailExportComponent } from './account-detail-export.component';

describe('AccountDetailExportComponent', () => {
  let component: AccountDetailExportComponent;
  let fixture: ComponentFixture<AccountDetailExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDetailExportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
