import { CalendarRowDirective } from './calendar-row.directive';
import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { FocusMonitor } from '@angular/cdk/a11y';

class MockElementRef extends ElementRef {}

describe('CalendarRowDirective', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarService, FocusMonitor, { provide: ElementRef, useClass: MockElementRef }]
    });
  });

  it('should create an instance', () => {
    TestBed.runInInjectionContext(() => {
      const directive = new CalendarRowDirective();
      expect(directive).toBeTruthy();
    });
  });
});
