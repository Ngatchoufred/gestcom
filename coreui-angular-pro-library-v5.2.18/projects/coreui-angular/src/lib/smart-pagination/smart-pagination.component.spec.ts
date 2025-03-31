import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartPaginationComponent } from './smart-pagination.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SmartPaginationComponent', () => {
  let component: SmartPaginationComponent;
  let fixture: ComponentFixture<SmartPaginationComponent>;
  let elementRef: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartPaginationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartPaginationComponent);
    component = fixture.componentInstance;
    elementRef = fixture.debugElement.query(By.css('ul'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have css classes', () => {
    expect(elementRef.nativeElement).toHaveClass('pagination');
  });
});
