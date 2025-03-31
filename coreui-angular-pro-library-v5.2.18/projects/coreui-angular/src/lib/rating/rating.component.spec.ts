import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingComponent } from './rating.component';
import { Component, computed, effect, signal } from '@angular/core';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    standalone: true,
    template: '<c-rating [(value)]="value" size="sm" [allowClear]="true" />',
    imports: [RatingComponent]
  })
  class TestComponent {
    value = signal<number | null>(7);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    component = fixture.nativeElement.querySelector('c-rating');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have css classes', () => {
    fixture.detectChanges();
    expect(component).toHaveClass('rating');
    expect(component).toHaveClass('rating-sm');
    expect(component).not.toHaveClass('disabled');
    expect(component).not.toHaveClass('readonly');
  });

  it('should emit output on value change', () => {
    TestBed.runInInjectionContext(() => {
      const expectedValue = computed(() => {
        return testComponent.value();
      });
      effect(() => {
        expect(expectedValue()).toBe(testComponent.value());
      });
      for (const i of [0, 3, 5, null]) {
        fixture.componentInstance.value.set(i);
        fixture.detectChanges();
        expect(expectedValue()).toBe(i);
      }
    });
  });
});
