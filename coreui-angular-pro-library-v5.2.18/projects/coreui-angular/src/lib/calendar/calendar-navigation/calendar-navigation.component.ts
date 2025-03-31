import { Component, DestroyRef, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgStyle } from '@angular/common';

import { ButtonDirective } from '../../button';
import { CalendarService, SelectionType } from '../calendar.service';

interface INavigationClick {
  direction: ('prev' | 'next');
  years: boolean;
}

@Component({
  selector: 'c-calendar-navigation',
  templateUrl: './calendar-navigation.component.html',
  styleUrls: ['./calendar-navigation.component.scss'],
  standalone: true,
  imports: [ButtonDirective, NgStyle]
})
export class CalendarNavigationComponent {

  #destroyRef = inject(DestroyRef);

  constructor(
    private calendarService: CalendarService
  ) {
    this.calendarStateSubscribe();
  }

  @Input() addMonths: number = 0;

  @Input()
  set calendarDate(value: Date) {
    this._calendarDate = value;
  };

  get calendarDate() {
    return this._calendarDate;
  }

  private _calendarDate = new Date();

  @Input() navigation: boolean = true;
  @Input() navYearFirst: boolean = false;

  locale: string = 'default';
  view: 'days' | 'months' | 'years' = 'days';
  selectionType: SelectionType = 'day';

  @Output() navigationClick: EventEmitter<INavigationClick> = new EventEmitter<INavigationClick>();

  get date() {
    return new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + this.addMonths);
  }

  @HostBinding('class')
  get hostClasses(): any {
    return {
      'calendar-nav': true
    };
  }

  calendarStateSubscribe(): void {
    this.calendarService.calendarState$
      .pipe(
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(state => {
        const keys = Object.keys(state);
        for (const key of keys) {
          if (key in this) {
            // @ts-ignore
            this[key] = state[key];
          }
        }
      });
  }

  setView(view: 'days' | 'months' | 'years') {
    this.view = view;
    this.calendarService.update({ view: view });
  }

  handleNavigationClick(direction: 'prev' | 'next', years = false) {
    this.navigationClick.emit({ direction, years: years });
  }

  handleNavigationKeyUp($event: KeyboardEvent, direction: 'prev' | 'next', years?: boolean) {
    if (['Space'].includes($event.code)) {
      $event.preventDefault();
      this.handleNavigationClick(direction, years);
    }
  }
}
