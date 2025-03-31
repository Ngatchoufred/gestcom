import {
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  numberAttribute,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
  WritableSignal
} from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs/operators';

import {
  convertToDateObject,
  createGroupsInArray,
  getMonthDetails,
  getMonthsNames,
  getYears,
  isDateBetweenMinMax,
  isDateDisabled,
  isDateInRangeDisabled,
  tryDate
} from '../calendar.utils';

import { CalendarService, DateFilterType, DayFormatType, SelectionType, WeekdayFormatType } from '../calendar.service';
import { CalendarWeekdayPipe } from './calendar-weekday.pipe';
import { CalendarClassYearPipe } from './calendar-class-year.pipe';
import { CalendarClassMonthPipe } from './calendar-class-month.pipe';
import { CalendarDayPipe } from './calendar-day.pipe';
import { CalendarDayDirective } from './calendar-day.directive';
import { CalendarDayTitlePipe } from './calendar-day-title.pipe';
import { CalendarClassDayPipe } from './calendar-class-day.pipe';
import { CalendarClassRowPipe } from './calendar-class-row.pipe';
import { CalendarRowDirective } from './calendar-row.directive';

@Component({
  selector: 'c-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  exportAs: 'cCalendarMonth',
  standalone: true,
  imports: [
    CalendarDayDirective,
    CalendarDayPipe,
    CalendarDayTitlePipe,
    CalendarRowDirective,
    CalendarClassDayPipe,
    CalendarClassMonthPipe,
    CalendarClassRowPipe,
    CalendarClassYearPipe,
    CalendarWeekdayPipe,
    NgClass,
    AsyncPipe
  ]
})
export class CalendarMonthComponent implements OnInit {

  #destroyRef = inject(DestroyRef);

  constructor(
    private calendarService: CalendarService
  ) {
    this.calendarStateSubscribe();
  }

  @Input() addMonths: number = 0;

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
    }
  }

  get startDate(): Date | null {
    return <Date | null>this._startDate;
  }

  _startDate: Date | null = null;

  /**
   * Initial selected to date (range).
   * @type  Date | null
   */
  @Input()
  set endDate(value: Date | number | string | null | undefined) {
    const date = !!value ? tryDate(value, 'endDate') : null;
    if (this._endDate?.getTime() !== date?.getTime()) {
      this._endDate = date;
      this.calendarService.update({ endDate: this._endDate });
    }
  }

  get endDate() {
    return this._endDate;
  }

  _endDate: (Date | null) = null;

  /**
   * Specify the list of dates that cannot be selected.
   * @type  Date[] | Date[][]
   */
  @Input()
  set disabledDates(value: Date[] | Date[][]) {
    this._disabledDates = value;
  }

  get disabledDates(): Date[] | Date[][] {
    return this._disabledDates;
  }

  private _disabledDates: (Date[] | Date[][]) = [];

  /**
   * Sets the day of start week.
   * - 0 - Sunday,
   * - 1 - Monday,
   * - 2 - Tuesday,
   * - 3 - Wednesday,
   * - 4 - Thursday,
   * - 5 - Friday,
   * - 6 - Saturday,
   */
  @Input({ transform: numberAttribute }) firstDayOfWeek: number = 1;

  /**
   * Sets the default locale for components. If not set, it is inherited from the browser.
   * @default 'default'
   */
  @Input()
  set locale(value) {
    this.#locale.set(value);
    // this.listOfMonths = createGroupsInArray(getMonthsNames(value), 4);
  }

  get locale() {
    return this.#locale();
  }

  #locale = signal('default');

  /**
   * Allow range selection.
   * @type boolean
   * @default false
   */
  @Input({ transform: booleanAttribute }) range: boolean = false;

  /**
   * Set length or format of day name.
   * @type number | 'long' | 'narrow' | 'short'
   * @default 'short'
   */
  @Input() weekdayFormat: WeekdayFormatType = 'short';

  /**
   * Set calendar view.
   * @type 'days' | 'months' | 'years'
   * @default 'days'
   */
  @Input()
  set view(value) {
    this.#view.set(value);
  }

  get view() {
    return this.#view();
  }

  #view = signal<'days' | 'months' | 'years'>('days');

  /**
   * Max selectable date.
   */
  @Input()
  set maxDate(value: Date | null) {
    this._maxDate = value ? tryDate(value, 'maxDate') : null;
  }

  get maxDate() {
    return this._maxDate;
  }

  private _maxDate: Date | null = null;

  /**
   * Min selectable date.
   */
  @Input()
  set minDate(value: Date | null) {
    this._minDate = value ? tryDate(value, 'minDate') : null;
  }

  get minDate() {
    return this._minDate;
  }

  private _minDate: Date | null = null;

  listOfMonths = computed(() => {
    return createGroupsInArray(getMonthsNames(this.#locale(), this.calendarDate$$().getFullYear()), 4);
  });
  listOfYears = computed(() => createGroupsInArray(getYears(this.calendarDate$$().getFullYear()), 4));

  /**
   * Default date of the component
   * @type Date
   */
  @Input()
  set calendarDate(value: (Date | string | number)) {
    const _value = new Date(tryDate((value ?? this.startDate), 'calendarDate'));
    if (!!_value && this.calendarDate$$().getTime() !== _value.getTime()) {
      this.calendarDate$$.set(new Date(new Date(_value.setDate(1)).setHours(0, 0, 0, 0)));
      this.setMonthDetails(this.date);
      this.calendarService.update({ calendarDate: this.calendarDate$$() });
    }
  }

  get calendarDate(): Date {
    return <Date>this.calendarDate$$() as Date;
  }

  calendarDate$$ = signal<Date>(new Date());

  @ViewChildren(CalendarDayDirective) calendarDays!: QueryList<CalendarDayDirective>;
  @ViewChildren(CalendarRowDirective) calendarRows!: QueryList<CalendarRowDirective>;

  dateFilter!: DateFilterType;

  get date() {
    return new Date(this.calendarDate?.getFullYear(), this.calendarDate?.getMonth() + this.addMonths);
  }

  dayFormat!: DayFormatType;
  selectAdjacentDays!: boolean;
  showAdjacentDays!: boolean;

  set selectionType(value: SelectionType) {
    this.#selectionType.set(value);
  }

  get selectionType() {
    return this.#selectionType();
  }

  #selectionType: WritableSignal<SelectionType> = signal('month');

  showWeekNumber: boolean = true;
  // set showWeekNumber(value: boolean) {
  //   this.#showWeekNumber$$.set(value);
  // }
  //
  // get showWeekNumber() {
  //   return this.#showWeekNumber$$();
  // }
  //
  // #showWeekNumber$$: WritableSignal<boolean> = signal(false);
  // showWeekNumber$$ = computed(() => this.#selectionType() === 'week' || this.#showWeekNumber$$());

  weekNumbersLabel!: string;

  private _monthDetails!: { weekNumber: number; days: { date: Date; month: string; }[]; }[];

  get monthDetails() {
    return this._monthDetails;
  }

  get weekDays() {
    return this.monthDetails[0].days;
  }

  ngOnInit(): void {
    this.setMonthDetails(this.date);
  }

  setMonthDetails(date: Date = this.date) {
    this._monthDetails = getMonthDetails(
      date.getFullYear(),
      date.getMonth(),
      this.firstDayOfWeek
    );
  }

  yearNumber(year: any) {
    return new Date(year, 0).toLocaleDateString(this.locale, { year: 'numeric' });
  }

  isDateDisabled(date: Date) {
    if (this.selectionType === 'year') {
      const minDate = this.minDate ? new Date(this.minDate.getFullYear(), 0, 1, 0, 0, 0, 0) : null;
      const maxDate = this.maxDate ? new Date(this.maxDate.getFullYear(), 11, 31, 0, 0, 0, 0) : null;
      return isDateDisabled(date, minDate, maxDate, this.disabledDates) || (this.dateFilter ? !this.dateFilter(date) : false);
    }
    if (this.selectionType === 'month') {
      const minDate = this.minDate ? new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 1, 0, 0, 0, 0) : null;
      const maxDate = this.maxDate ? new Date(this.maxDate.getFullYear(), this.maxDate.getMonth() + 1, 1, 0, 0, -1, 0) : null;
      return isDateDisabled(date, minDate, maxDate, this.disabledDates) || (this.dateFilter ? !this.dateFilter(date) : false);
    }
    return isDateDisabled(date, this.minDate, this.maxDate, this.disabledDates) || (this.dateFilter ? !this.dateFilter(date) : false);
  }

  calendarCellTitle(date: Date) {
    return date.toLocaleDateString(this.locale);
  }

  handleCellMouseEnter(hoverDate: Date) {
    const updateHoverValue = (['day', 'week'].includes(this.selectionType) && this.view === 'days') ||
      ['month'].includes(this.selectionType) && this.view === 'months' ||
      ['year'].includes(this.selectionType) && this.view === 'years';

    // if (updateHoverValue) {
    const hoverValue = this.isDateDisabled(hoverDate) || !updateHoverValue ? null : hoverDate;
    this.calendarService.update({ hoverDate: hoverValue });
    // }
  }

  handleYearCellClick(year: number) {
    if (this.selectionType === 'year') {
      let date = new Date(year, 0, 1, 0, 0, 0, 0);
      if (this.range && this.startDate && !this.endDate) {
        date = new Date(date.getFullYear(), 12, 1, 0, 0, -1, 0);
      }
      this.handleDayCellClick(date);
      return;
    }
    const calendarDate = new Date(year, 0, 1, 0, 0, 0, 0);
    this.view = 'months';
    this.calendarService.update({ view: this.view, calendarDate: calendarDate });

  }

  handleYearCellKeyUp($event: KeyboardEvent, date: Date) {
    if (['Space', 'Enter'].includes($event.code)) {
      this.handleYearCellClick(date.getFullYear());
      return;
    }
    if (['Tab', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes($event.code)) {
      this.handleCellMouseEnter(new Date(date));
      return;
    }
  }

  handleMonthCellKeyUp($event: KeyboardEvent, date: Date) {
    if (['Space', 'Enter'].includes($event.code)) {
      this.handleMonthCellClick(date);
      return;
    }
    if (['Tab', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes($event.code)) {
      this.handleCellMouseEnter(date);
      return;
    }
  }

  handleMonthCellClick(value: Date) {
    if (this.selectionType === 'month') {
      let date = new Date(value.getFullYear(), value.getMonth(), 1, 0, 0, 0, 0);
      if (this.range && this.startDate && !this.endDate) {
        date = new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, -1, 0);
      }
      this.handleDayCellClick(date);
      return;
    }

    this.setCalendarPage(0, 0, value.getMonth() - this.addMonths);
    this.view = 'days';
    this.calendarService.update({ view: this.view });
  }

  setCalendarPage(years: number, months = 0, setMonth?: number) {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    const d = new Date(year, month, 1, 0, 0, 0, 0);

    years && d.setFullYear(d.getFullYear() + years);
    months && d.setMonth(d.getMonth() + months);
    typeof setMonth === 'number' && d.setMonth(setMonth);

    this.calendarService.update({ calendarDate: d });
  }

  handleDayCellKeyDown($event: KeyboardEvent, date: Date) {

    if (!['Tab', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes($event.code)) {
      return;
    }
    $event.preventDefault();
    this.handleCellMouseEnter(date);

    const eventKey = $event.key === 'Tab' ? ($event.shiftKey ? 'ArrowLeft' : 'ArrowRight') : $event.key;

    if (this.maxDate && date >= convertToDateObject(this.maxDate, this.selectionType) && (['ArrowRight', 'ArrowDown'].includes(eventKey))) {
      return;
    }
    if (this.minDate && date <= convertToDateObject(this.minDate, this.selectionType) && (['ArrowLeft', 'ArrowUp'].includes(eventKey))) {
      return;
    }

    let element = $event.target as HTMLElement;

    if (this.selectionType === 'week' && this.view === 'days' && element.tabIndex === -1) {
      element = element.closest('tr[tabindex="0"]') as HTMLElement;
    }

    const elements = ['week'].includes(this.selectionType) && this.view === 'days' ? this.calendarRows : this.calendarDays;

    // @ts-ignore
    const list = elements.toArray()
      .map(calendarCell => calendarCell.elementRef.nativeElement as HTMLElement)
      // .filter((element) => this.selectionType === 'week' ? element?.tabIndex === 0 : element?.classList.contains('current'))
      .filter((element) => element?.tabIndex === 0);

    const index = list.indexOf(element);
    const first = index === 0;
    const last = index === list.length - 1;

    const toBoundary = {
      start: index,
      end: list.length - (index + 1)
    };

    const gap = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowUp: this.selectionType === 'week' && this.view === 'days' ? -1 : this.view === 'days' ? -7 : -3,
      ArrowDown: this.selectionType === 'week' && this.view === 'days' ? 1 : this.view === 'days' ? 7 : 3
    };

    if (
      (eventKey === 'ArrowRight' && last) ||
      (eventKey === 'ArrowDown' && toBoundary.end < gap.ArrowDown) ||
      (eventKey === 'ArrowLeft' && first) ||
      (eventKey === 'ArrowUp' && toBoundary.start < Math.abs(gap.ArrowUp))
    ) {

      elements.changes.pipe(
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      ).subscribe((change: QueryList<CalendarRowDirective | CalendarDayDirective>) => {

        const _list = change
          .toArray()
          // .filter(element => this.selectionType === 'week' ? element?.elementRef.nativeElement.tabIndex === 0 : element?.elementRef.nativeElement.classList.contains('current'));
          .filter(element => element?.elementRef.nativeElement.tabIndex === 0);

        if (_list.length) {
          let dayToFocus: CalendarDayDirective | CalendarRowDirective | undefined;
          switch (eventKey) {
            case 'ArrowRight': {
              dayToFocus = _list[0];
              break;
            }
            case 'ArrowLeft': {
              dayToFocus = _list[_list.length - 1];
              break;
            }
            case 'ArrowDown': {
              dayToFocus = _list[gap.ArrowDown - (list.length - index)];
              break;
            }
            case 'ArrowUp': {
              dayToFocus = _list[_list.length - (Math.abs(gap.ArrowUp) + 1 - (index + 1))];
              break;
            }
          }
          if (!dayToFocus?.disabled) {
            // console.log('dayToFocus', dayToFocus?.date);
            dayToFocus?.focus('keyboard');
          }
        }
      });

      if (this.view === 'days') {
        this.setCalendarPage(0, ['ArrowRight', 'ArrowDown'].includes(eventKey) ? 1 : -1);
      }
      if (this.view === 'months') {
        this.setCalendarPage(['ArrowRight', 'ArrowDown'].includes(eventKey) ? 1 : -1);
        // this.calendarDays?.reset(this.calendarDays.toArray());
        // this.calendarDays?.notifyOnChanges();
      }
      if (this.view === 'years') {
        this.setCalendarPage(['ArrowRight', 'ArrowDown'].includes(eventKey) ? 12 : -12);
      }

      return;
    }

    // @ts-ignore
    const nextElement = list[index + gap[eventKey]];
    if (nextElement?.tabIndex === 0) {
      nextElement.focus();
      return;
    }

    for (let i = index; i < list.length; list.length && ['ArrowRight', 'ArrowDown'].includes(eventKey) ? i++ : i--) {
      // @ts-ignore
      const nextElement = list[i + gap[eventKey]];
      if (nextElement?.tabIndex === 0) {
        // @ts-ignore
        nextElement?.focus();
        break;
      }
      // @ts-ignore
      if (!nextElement) {
        break;
      }
    }
  }

  handleCellMouseLeave() {
    this.calendarService.update({ hoverDate: null });
  }

  handleDayCellKeyUp($event: KeyboardEvent, date: Date) {
    if (['Space', 'Enter'].includes($event.code)) {
      this.handleDayCellClick(date);
      return;
    }
    if (['Tab', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes($event.code)) {
      this.handleCellMouseEnter(date);
      return;
    }
  }

  handleDayCellClick(date: Date) {
    if (this.selectionType === 'day' && this.isDateDisabled(date)) {
      return;
    }

    if (!this.range) {
      this.endDate = null;
      this.startDate = date;
      return;
    }

    if (this.startDate && this.endDate) {
      this.calendarDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
      this.endDate = null;
      this.startDate = null;
      return;
    }

    if (!!this.startDate && !this.endDate) {
      if (this.startDate && date < this.startDate) {
        this.endDate = null;
        this.startDate = date;
      } else {
        this.endDate = date;
      }
    } else {
      this.endDate = null;
      this.startDate = date;
    }

    if (this.startDate && this.endDate) {
      // @ts-ignore
      if (isDateInRangeDisabled(this.startDate, this.endDate, this.disabledDates)) {
        this.startDate = null;
        this.endDate = null;
        return;
      }

      // let date = new Date(this.startDate);
      // while (date < this.endDate) {
      //   date.setDate(date.getDate() + 1);
      //   if (this.isDateDisabled(date)) {
      //     this.startDate = null;
      //     this.endDate = null;
      //     break;
      //   }
      // }
    }
  }

  calendarStateSubscribe(): void {
    this.calendarService.calendarState$.pipe(
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(state => {
      const keys = Object.keys(state);

      for (const key of keys) {
        // if (key in this) {
        // @ts-ignore
        this[key] = state[key];
        // }
      }
    });
  }

  getMonthStart(index: number) {
    return new Date(this.calendarDate.getFullYear(), index, 1, 0, 0, 0, 0);
  }

  getMonthEnd(index: number) {
    return new Date(this.calendarDate.getFullYear(), index + 1, 1, 0, 0, -1, 0);
  }

  protected readonly isDateInRangeDisabled = isDateInRangeDisabled;
  protected readonly isDateBetweenMinMax = isDateBetweenMinMax;

  getYearStart(year: number) {
    return new Date(year, 0, 1);
  }

  getYearEnd(year: number) {
    return new Date(year, 11, 1, 0, 0, -1, 0);
  }
}
