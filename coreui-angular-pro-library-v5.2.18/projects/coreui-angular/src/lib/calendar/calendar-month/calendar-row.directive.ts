import { DestroyRef, Directive, ElementRef, HostBinding, inject, Input, signal } from '@angular/core';
import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { CalendarService, DateFilterType, SelectionType } from '../calendar.service';
import { convertToDateObject, isDateDisabled, isDateInRange, isDateSelected } from '../calendar.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[cCalendarRow]',
  standalone: true,
  exportAs: 'cCalendarRow'
})
export class CalendarRowDirective implements FocusableOption {

  #destroyRef = inject(DestroyRef);
  #calendarService = inject(CalendarService);
  elementRef = inject(ElementRef);
  focusMonitor = inject(FocusMonitor);

  constructor() {
    this.#calendarService.calendarState$.pipe(
      distinctUntilChanged(),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(state => {
      const {
        startDate = this.startDate,
        endDate = this.endDate,
        hoverDate = this.hoverDate,
        maxDate = this.maxDate,
        minDate = this.minDate,
        range = this.range,
        disabledDates = this.disabledDates,
        dateFilter = this.dateFilter,
        selectionType = this.selectionType,
        calendarDate = this.calendarDate,
        locale = this.locale
      } = { ...state };
      this.startDate = startDate;
      this.endDate = endDate;
      this.hoverDate = hoverDate;
      this.maxDate = maxDate;
      this.minDate = minDate;
      this.range = range;
      this.disabledDates = disabledDates;
      this.dateFilter = dateFilter;
      this.selectionType = selectionType;
      this.calendarDate = calendarDate ?? new Date();
      this.locale = locale ?? 'default';

      // this.#tabindex.set(this.selectionType === 'week' && this.current && !this.disabled ? 0 : -1);

    });
  }

  @Input({ alias: 'cCalendarRow', required: true })
  set week(value: {
    weekNumber: number,
    days: { date: Date, month: string }[]
  }) {
    this.current = value.days.some((day) => day.month === 'current');
    this.#tabindex.set(this.selectionType === 'week' && this.current && !this.disabled ? 0 : -1);
    this.#week = value;
  };

  get week() {
    return this.#week;
  }

  #week: any;

  public date: Date | null = null;
  private startDate: Date | null = null;
  private endDate: Date | null = null;
  private hoverDate: Date | null = null;
  private maxDate: Date | null = null;
  private minDate: Date | null = null;
  private range: boolean = false;
  private selectionType: SelectionType = 'week';
  private disabledDates!: (Date | Date[])[];
  private dateFilter!: DateFilterType;
  private calendarDate: Date = new Date();
  private locale: string = 'default';
  disabled!: boolean;
  current!: boolean;

  @HostBinding('attr.tabindex') get tabindex(): number {
    return this.#tabindex();
  };

  #tabindex = signal(-1);

  get selectEndDate(): boolean {
    return (this.range && !!this.startDate && !this.endDate);
  }

  @HostBinding('class')
  get hostClasses(): any {

    if (!this.week) {
      return {
        'calendar-row': true
      };
    }

    const week = this.week;
    const calendarDate = this.calendarDate;
    const selectionType = this.selectionType;

    this.date = convertToDateObject(
      week.weekNumber === 0
      ? `${calendarDate.getFullYear()}W53`
      : `${calendarDate.getFullYear()}W${week.weekNumber}`,
      selectionType
    );

    this.current = week.days.some((day) => day.month === 'current');

    const inRange = this.selectionType === 'week' && isDateInRange(this.date, this.startDate, this.endDate);
    const rangeHover = this.selectionType === 'week' && this.hoverDate && this.selectEndDate
                       ? isDateInRange(this.date, this.startDate, this.hoverDate)
                       : isDateInRange(this.date, this.hoverDate, this.endDate);
    const selected = isDateSelected(this.date, this.startDate, this.endDate);
    const disabledDate = isDateDisabled(this.date, this.minDate, this.maxDate, this.disabledDates);
    const disabledByFilter = (Object.prototype.toString.call(this.dateFilter) === '[object Function]' && this.date) ? !this.dateFilter(this.date) : false;

    this.disabled = disabledDate || disabledByFilter;

    return {
      'calendar-row': true,
      disabled: this.disabled,
      range: inRange,
      'range-hover': rangeHover,
      selected: selected,
      current: this.current
    };

  }

  focus(origin?: FocusOrigin): void {
    this.focusMonitor.focusVia(this.elementRef.nativeElement, origin ?? 'keyboard');
  }

  getLabel(): string {
    return this.date?.toLocaleDateString(this.locale) ?? '';
  }

}
