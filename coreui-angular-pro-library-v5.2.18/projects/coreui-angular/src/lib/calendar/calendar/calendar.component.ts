import {
  booleanAttribute,
  Component,
  DestroyRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  numberAttribute,
  OnInit,
  Output,
  QueryList,
  signal,
  ViewChildren
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { A11yModule, FocusOrigin } from '@angular/cdk/a11y';

import { CalendarService, DateFilterType, DayFormatType, SelectionType, WeekdayFormatType } from '../calendar.service';
import { getCalendarDate, tryDate } from '../calendar.utils';
import { CalendarMonthComponent } from '../calendar-month/calendar-month.component';
import { CalendarNavigationComponent } from '../calendar-navigation/calendar-navigation.component';
import { CalendarClassViewPipe } from './calendar-class-view.pipe';

@Component({
  selector: 'c-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  exportAs: 'cCalendar',
  providers: [CalendarService],
  standalone: true,
  imports: [CalendarNavigationComponent, CalendarClassViewPipe, CalendarMonthComponent, NgClass, A11yModule]
})
export class CalendarComponent implements OnInit {
  #destroyRef = inject(DestroyRef);

  constructor(private calendarService: CalendarService) {
    this.calendarStateSubscribe();
  }

  /**
   * Default date of the component
   * @type  Date | string
   */
  @Input()
  set calendarDate(value: Date | string | number) {
    // const _value = new Date(tryDate((value ?? this.startDate ?? new Date()), 'calendarDate'));
    const _value = new Date(tryDate(value ?? this.startDate, 'calendarDate'));
    // if (!isDateBetweenMinMax(_value, this.minDate, this.maxDate)) {
    //   // _value = _value < (this.minDate ?? 0) ? this.minDate ?? this.maxDate ?? _value : this.maxDate ?? this.minDate ?? _value;
    //   // return;
    //   _value = this._calendarDate;
    // }
    if (!!_value && this._calendarDate.getTime() !== _value.getTime()) {
      const _calendarDate = new Date(new Date(_value.setDate(1)).setHours(0, 0, 0, 0));
      this._calendarDate = _calendarDate;
      this.calendarDateChange.emit(_calendarDate);
      this.calendarService.update({ calendarDate: _calendarDate });
    }
  }

  get calendarDate(): Date {
    return this._calendarDate;
  }

  private _calendarDate: Date = tryDate(new Date());

  /**
   * The number of calendars that render on desktop devices.
   * @type number
   * default 1
   */
  @Input({ transform: numberAttribute })
  set calendars(value: number) {
    this._calendars = value;
  }

  get calendars(): number {
    return this._calendars;
  }

  private _calendars: number = 1;

  get calendarsArray() {
    return Array.from({ length: this.calendars }, (v, i) => i);
  }

  /**
   * Set the format of day name.
   * @default 'numeric'
   * @type DayFormatType
   */
  @Input()
  set dayFormat(value: DayFormatType) {
    this._dayFormat = value;
    this.calendarService.update({ dayFormat: this._dayFormat });
  }

  get dayFormat() {
    return this._dayFormat;
  }

  private _dayFormat: DayFormatType = 'numeric';

  /**
   * Specify the list of dates that cannot be selected.
   * @type  Date[] | Date[][]
   */
  @Input()
  set disabledDates(value: Date[] | Date[][]) {
    this._disabledDates = value;
    this.calendarService.update({ disabledDates: this._disabledDates });
  }

  get disabledDates(): Date[] | Date[][] {
    return this._disabledDates;
  }

  private _disabledDates: Date[] | Date[][] = [];

  /**
   * Initial selected date.
   * @type  (Date | null)
   */
  @Input()
  set startDate(value: Date | number | string | null | undefined) {
    const date = !!value ? tryDate(value, 'startDate') : null;
    if (this._startDate?.getTime() !== date?.getTime()) {
      this._startDate = date;
      this.calendarService.update({ startDate: this._startDate });
      if (!this.range || !this._startDate || (this.endDate && this._startDate > this.endDate)) {
        this.endDate = null;
      }
    }
  }

  get startDate() {
    return this._startDate;
  }

  _startDate: Date | null = null;

  /**
   * Initial selected to date (range).
   * @type Date | null
   */
  @Input()
  set endDate(value: Date | number | string | null | undefined) {
    const date = !!value ? tryDate(value, 'endDate') : null;
    if (this._endDate?.getTime() !== date?.getTime()) {
      this._endDate = date;
      // this._endDate = this.range ? this._endDate : null;
      this.calendarService.update({ endDate: this._endDate });
    }
  }

  get endDate() {
    return this.range ? this._endDate : null;
  }

  _endDate: Date | null = null;

  /**
   * Sets the day of start week.
   * - 0 - Sunday,
   * - 1 - Monday,
   * - 2 - Tuesday,
   * - 3 - Wednesday,
   * - 4 - Thursday,
   * - 5 - Friday,
   * - 6 - Saturday,
   *
   * @type number
   * @default 1
   */
  @Input({ transform: numberAttribute })
  set firstDayOfWeek(value: number) {
    this._firstDayOfWeek = value;
  }

  get firstDayOfWeek(): number {
    return this._firstDayOfWeek;
  }

  private _firstDayOfWeek: number = 1;

  /**
   * Sets the default locale for components. If not set, it is inherited from the browser.
   * @default 'default'
   */
  @Input()
  set locale(value: string) {
    this._locale = value;
    this.calendarService.update({ locale: value });
  }

  get locale() {
    return this._locale;
  }

  private _locale: string = 'default';

  /**
   * Max selectable date.
   */
  @Input()
  set maxDate(value: Date | string | null | undefined) {
    this._maxDate = !!value ? tryDate(value, 'maxDate') : null;
    this.calendarService.update({ maxDate: this._maxDate });
  }

  get maxDate(): Date | null {
    return this._maxDate;
  }

  private _maxDate: Date | null = null;

  /**
   * Min selectable date.
   */
  @Input()
  set minDate(value: Date | string | null | undefined) {
    this._minDate = value ? tryDate(value, 'minDate') : null;
    this.calendarService.update({ minDate: this._minDate });
  }

  get minDate(): Date | null {
    return this._minDate;
  }

  private _minDate: Date | null = null;

  /**
   * Show navigation.
   * @type boolean
   */
  @Input({ transform: booleanAttribute })
  set navigation(value: boolean) {
    this._navigation = value;
  }

  get navigation(): boolean {
    return this._navigation;
  }

  private _navigation: boolean = true;

  /**
   * Reorder year-month navigation, and render year first.
   * @type boolean
   * @default false
   */
  @Input({ transform: booleanAttribute })
  set navYearFirst(value: boolean) {
    this._navYearFirst = value;
    this.calendarService.update({ navYearFirst: this._navYearFirst });
  }

  get navYearFirst() {
    return this._navYearFirst;
  }

  private _navYearFirst: boolean = false;

  /**
   * Allow range selection.
   * @type boolean
   * @default false
   */
  @Input({ transform: booleanAttribute })
  set range(value: boolean) {
    this._range = value;
    this.calendarService.update({ range: this._range });
  }

  get range(): boolean {
    return this._range;
  }

  private _range: boolean = false;

  /**
   * Set calendar view.
   * @type 'days' | 'months' | 'years'
   * @default 'days'
   */
  @Input()
  set view(value) {
    // if (!['days', 'weeks'].includes(this.selectionType)) {
    //   value = this.selectionType === 'month' ? 'months' : 'years';
    // }
    this._view = value;
    this.calendarService.update({ view: value });
  }

  get view() {
    return this._view;
  }

  private _view: 'days' | 'months' | 'years' = 'days';

  /**
   * Set length or format of day name.
   * @type number | 'long' | 'narrow' | 'short'
   * @default 'short'
   */
  @Input()
  set weekdayFormat(value: WeekdayFormatType) {
    this._weekdayFormat = value;
    this.calendarService.update({ weekdayFormat: this._weekdayFormat });
  }

  get weekdayFormat() {
    return this._weekdayFormat;
  }

  private _weekdayFormat: WeekdayFormatType = 'short';

  @Input()
  set dateFilter(value: DateFilterType | undefined) {
    this.calendarService.update({ dateFilter: value });
  }

  /**
   * Set whether days in adjacent months shown before or after the current month are selectable. This only applies if the `showAdjacentDays` option is set to true.
   * @type boolean
   * @default false
   * @since 4.4.10
   */
  @Input({ transform: booleanAttribute })
  set selectAdjacentDays(value: boolean) {
    this.calendarService.update({ selectAdjacentDays: value });
  }

  /**
   * Set whether to display dates in adjacent months (non-selectable) at the start and end of the current month.
   * @type boolean
   * @default true
   * @since 4.4.10
   */
  @Input({ transform: booleanAttribute })
  set showAdjacentDays(value: boolean) {
    this.calendarService.update({ showAdjacentDays: value ?? true });
  }

  /**
   * Specify the type of date selection as day, week, month, or year.
   * @type 'day' | 'week' | 'month' | 'year'
   * @default 'day'
   * @since 5.0.0
   */
  @Input()
  set selectionType(value: SelectionType) {
    this.calendars = ['month', 'year'].includes(value) ? 1 : this.calendars;
    this.#selectionType = value;
    this.view = ['day', 'week'].includes(value) ? 'days' : value === 'month' ? 'months' : 'years';
    this.calendarService.update({ selectionType: value, view: this.view });
  }

  get selectionType(): SelectionType {
    return this.#selectionType;
  }

  // #selectionType = signal<SelectionType>('month');
  #selectionType = 'day' as SelectionType;

  /**
   * Set whether to display week numbers in the calendar.
   * @type boolean
   * @default false
   * @since 5.0.0
   */
  @Input({ transform: booleanAttribute })
  set showWeekNumber(value: boolean) {
    this.#showWeekNumber.set(value);
    this.calendarService.update({ showWeekNumber: value });
  }

  #showWeekNumber = signal(false);

  /**
   * Label displayed over week numbers in the calendar.
   * @type string
   * @default undefined
   * @since 5.0.0
   */
  @Input() set weekNumbersLabel(value: string | undefined) {
    this.calendarService.update({ weekNumbersLabel: value });
  }

  @Output() calendarCellHover: EventEmitter<Date | null> = new EventEmitter<Date | null>();
  @Output() calendarDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() endDateChange: EventEmitter<Date | null> = new EventEmitter<Date | null>();
  @Output() startDateChange: EventEmitter<Date | null> = new EventEmitter<Date | null>();
  @Output() viewChange: EventEmitter<string> = new EventEmitter<string>();

  // used with calendarService
  set hoverDate(value: Date | null) {
    this._hoverDate = value;
    this.calendarCellHover.emit(value);
  }

  get hoverDate(): Date | null {
    return this._hoverDate;
  }

  private _hoverDate: Date | null = null;

  @HostBinding('class')
  get hostClasses(): any {
    const selectionType = this.#selectionType;
    const view = this.view;
    return {
      calendars: true,
      [`select-${selectionType}`]: selectionType && view === 'days',
      'show-week-numbers': this.#showWeekNumber()
    };
  }

  @ViewChildren(CalendarMonthComponent) calendarMonths!: QueryList<CalendarMonthComponent>;

  ngOnInit(): void {
    this.calendarService.update({
      locale: this.locale ?? 'default',
      view: this.view,
      range: this.range,
      selectionType: this.selectionType
      // showAdjacentDays: this.showAdjacentDays,
      // selectAdjacentDays: this.selectAdjacentDays
    });
  }

  calendarStateSubscribe(): void {
    this.calendarService.calendarState$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((state) => {
      const keys = Object.keys(state);
      for (const key of keys) {
        if (key in this) {
          // @ts-ignore
          if (this[key] !== state[key]) {
            // @ts-ignore
            this[key] = state[key];
            if (key === 'startDate') {
              setTimeout(() => {
                this.startDateChange.emit(this._startDate);
              });
              continue;
            }
            if (key === 'endDate') {
              setTimeout(() => {
                this.endDateChange.emit(this._endDate);
              });
            }
          }
        }
      }
    });
  }

  setCalendarPage(years: number, months = 0, setMonth?: number) {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    const d = new Date(year, month, 1);

    years && d.setFullYear(d.getFullYear() + years);
    months && d.setMonth(d.getMonth() + months);
    typeof setMonth === 'number' && d.setMonth(setMonth);

    this.calendarDate = d;
  }

  handleNavigationClick(direction: 'prev' | 'next', years = false) {
    if (direction === 'prev') {
      if (years) {
        this.setCalendarPage(this.view === 'years' ? -10 : -1);
        return;
      }

      if (this.view !== 'days') {
        this.setCalendarPage(-1);
        return;
      }

      this.setCalendarPage(0, -1);
      return;
    }
    if (direction === 'next') {
      if (years) {
        this.setCalendarPage(this.view === 'years' ? 10 : 1);
        return;
      }

      if (this.view !== 'days') {
        this.setCalendarPage(1);
        return;
      }

      this.setCalendarPage(0, 1);
      return;
    }
  }

  /**
   * Clear startDate and endDate
   * @type void
   */
  public clearDates() {
    this.calendarService.update({ endDate: null });
    this.calendarService.update({ startDate: null });
  }

  handleFocusChange($event: FocusOrigin) {
    if ($event === null) {
      this.calendarService.update({ hoverDate: null });
    }
  }

  protected readonly getCalendarDate = getCalendarDate;
}
