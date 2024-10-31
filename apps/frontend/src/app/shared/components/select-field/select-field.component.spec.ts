import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectFieldComponent } from './select-field.component';

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent<unknown>;
  let fixture: ComponentFixture<SelectFieldComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('value', undefined);
    fixture.componentRef.setInput('options', [
      { label: 'Unset', value: undefined },
      { label: 'Set', value: 'value' },
    ]);
    fixture.componentRef.setInput('label', 'My label');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
