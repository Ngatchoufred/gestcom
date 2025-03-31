import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectOptionComponent } from './multi-select-option.component';
import { MultiSelectService } from '../multi-select.service';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [MultiSelectOptionComponent],
  template: `<c-multi-select-option value="value" label="label" />`,
})
class TestHostComponent {
}

describe('MultiSelectOptionComponent', () => {
  let testHost: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let service: MultiSelectService;
let elementRef: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectOptionComponent, TestHostComponent],
      providers: [MultiSelectService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    service = TestBed.inject(MultiSelectService);
    service.setSelectionModel(true)
    elementRef = fixture.debugElement.query(By.css('c-multi-select-option'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(testHost).toBeDefined();
  });

  it('should have css classes', () => {
    expect(elementRef.nativeElement).toHaveClass('form-multi-select-option');
  });
});
