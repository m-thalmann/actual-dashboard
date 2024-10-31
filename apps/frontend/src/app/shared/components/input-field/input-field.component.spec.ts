import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFieldComponent } from './input-field.component';

const mockInitialValue = 'My input';
const mockLabel = 'My label';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('value', mockInitialValue);
    fixture.componentRef.setInput('label', mockLabel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show clear button', () => {
    const clearButton = (fixture.nativeElement as HTMLElement).querySelector('button.clear-button');

    expect(clearButton).toBeNull();
  });

  it('should show clear button', () => {
    fixture.componentRef.setInput('clearable', true);
    fixture.detectChanges();

    const clearButton = (fixture.nativeElement as HTMLElement).querySelector('button.clear-button');

    expect(clearButton).toBeDefined();
  });
});
