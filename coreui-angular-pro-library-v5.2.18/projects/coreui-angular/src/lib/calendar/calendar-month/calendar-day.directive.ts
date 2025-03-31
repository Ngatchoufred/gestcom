import {
  booleanAttribute,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  Input,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { tap } from 'rxjs/operators';
import {
  isDateDisabled,
  isDateInRange,
  isDateInRangeDisabled,
  isDateSelected,
  isEndDate,
  isMonthSelected,
  isStartDate,
  isYearInRange,
  isYearSelected
} from '../calendar.utils';
import { CalendarService, ICalendarState } from '../calendar.service';

@Directive({
  selector: '[cCalendarDay]',
  standalone: true,
  exportAs: 'cCalendarDay'
})
export class CalendarDayDirective implements FocusableOption {
  #destroyRef = inject(DestroyRef);
  #calendarService = inject(CalendarService);
  elementRef = inject(ElementRef);
  focusMonitor = inject(FocusMonitor);

  #calendarState = signal<ICalendarState>({ ...this.#calendarService.calendarStateObject });

  constructor() {
    this.#calendarService.calendarState$
      .pipe(
        tap((state) => {
          this.#calendarState.set(state);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  @Input() date!: Date;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() month = 'current';
  @Input() calendarDate = new Date();

  #selectEndDate = computed(() => {
    const state = this.#calendarState();
    return <boolean>(state.range && !!state.startDate && !state.endDate);
  });

  disabled$ = computed(() => {
    const state = { ...this.#calendarState() };

    const dateYear = this.date.getFullYear();

    switch (state.view) {
      case 'months': {
        const dateMonth = dateYear * 100 + this.date.getMonth();
        const minDate = state.minDate ? state.minDate.getFullYear() * 100 + state.minDate?.getMonth() : undefined;
        const maxDate = state.maxDate ? state.maxDate.getFullYear() * 100 + state.maxDate?.getMonth() : undefined;
        this.disabled = (minDate ? dateMonth < minDate : false) || (maxDate ? dateMonth > maxDate : false);
        break;
      }
      case 'years': {
        const minYear = state.minDate?.getFullYear();
        const maxYear = state.maxDate?.getFullYear();
        this.disabled = (minYear ? dateYear < minYear : false) || (maxYear ? dateYear > maxYear : false);
        break;
      }
    }
    return this.disabled;
  });

  @HostBinding('class')
  get hostClasses(): any {
    if (!this.date) {
      return;
    }

    const state = this.#calendarState();
    state.startDate = state.startDate ?? null;
    state.hoverDate = state.hoverDate ?? null;
    state.endDate = state.endDate ?? null;

    const start = isStartDate(this.date, state.startDate, state.endDate);
    const end = isEndDate(this.date, state.startDate, state.endDate);

    let selected: boolean = false;
    let clickable: boolean = false;
    let rangeHover: boolean = false;
    let inRange: boolean = false;
    let disabledRange: boolean = false;
    let disabledDate: boolean = false;
    let disabledByFilter: boolean = false;

    switch (state.view) {
      case 'months':
        if (state.selectionType === 'month') {
          selected = !!isMonthSelected(this.date, state.startDate, state.endDate);
          inRange = !!isDateInRange(this.date, state.startDate, state.endDate);
          rangeHover = this.#selectEndDate() && !!isDateInRange(this.date, state.startDate, state.hoverDate);
        }
        break;
      case 'years':
        if (state.selectionType === 'year') {
          selected = !!isYearSelected(this.date, state.startDate, state.endDate);
          inRange = !!isDateInRange(this.date, state.startDate, state.endDate);
          rangeHover = this.#selectEndDate() && !!isYearInRange(this.date, state.startDate, state.hoverDate);
        }
        break;
      default:
        selected = state.selectionType === 'day' && !!isDateSelected(this.date, state.startDate, state.endDate);
        clickable = this.month !== 'current' && !!state.selectAdjacentDays;
        rangeHover =
          state.selectionType === 'day' &&
          this.month === 'current' &&
          this.#selectEndDate() &&
          !!isDateInRange(this.date, state.startDate, state.hoverDate);
        inRange =
          this.month === 'current' && (isDateInRange(this.date, state.startDate, state.endDate) || !!start || !!end);
        disabledRange = isDateInRangeDisabled(state.startDate, this.date, state.disabledDates);
        disabledDate = isDateDisabled(this.date, state.minDate, state.maxDate, state.disabledDates);
        disabledByFilter =
          state.dateFilter && Object.prototype.toString.call(state.dateFilter) === '[object Function]' && this.date
            ? !state.dateFilter(this.date)
            : false;
        this.disabled = disabledDate || disabledByFilter;
    }

    return {
      'range-hover': rangeHover && (!disabledRange || !disabledByFilter),
      selected: selected,
      range: inRange,
      start: !!start,
      end: !!end,
      disabled: this.disabled,
      clickable: clickable
    };
  }

  focus(origin?: FocusOrigin): void {
    this.focusMonitor.focusVia(this.elementRef.nativeElement, origin ?? 'keyboard');
  }

  getLabel(): string {
    return this.date?.toLocaleDateString(this.#calendarState().locale) ?? '';
  }
}
