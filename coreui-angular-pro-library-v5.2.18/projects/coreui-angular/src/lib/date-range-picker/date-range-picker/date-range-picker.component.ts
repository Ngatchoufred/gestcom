import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  effect,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  input,
  Input,
  model,
  ModelSignal,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { formatDate, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

import { Options } from '@popperjs/core';

import { ButtonDirective } from '../../button';
import { dateTransform, getLocalDateFromString, isDateDisabled, isValidDate } from '../../calendar/calendar.utils';
import { DateFilterType, DayFormatType, WeekdayFormatType } from '../../calendar/calendar.service';
import { CalendarComponent } from '../../calendar';
import { Colors } from '../../coreui.types';
import { DropdownComponent, DropdownMenuDirective, DropdownToggleDirective } from '../../dropdown';
import { FormControlDirective, InputGroupComponent, InputGroupTextDirective } from '../../form';
import { TemplateIdDirective } from '../../shared';
import { TimePickerComponent } from '../../time-picker';
import { CustomRangeKeyPipe } from './custom-range-key.pipe';

export interface ICalendarRanges {
  [key: string]: Date[];
}

export type TCustomRange = [string, Date[]];

/** Must be a valid date string */
// todo: validation
// export function invalidDateStringValidator(locale: string): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     // const validDate = !isNaN(Date.parse(control.value));
//     stringToDateConvert(control.value, locale);
//     const dateShim = cvtDate(control.value, locale);
//     // @ts-ignore
//     // control.setValue(new Date(dateShim.year, dateShim.month, dateShim.day))
//     console.log('dateShim', dateShim, locale);
//     const validDate = isValidDate(control.value);
//     console.log('invalidDateStringValidator', control, control.value, validDate);
//     return validDate ? { invalidDateStringValidator: { value: control.value } } : null;
//   };
// }

@Component({
  selector: 'c-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  exportAs: 'cDateRangePicker',
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    ReactiveFormsModule,
    CalendarComponent,
    TimePickerComponent,
    ButtonDirective,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    InputGroupComponent,
    FormControlDirective,
    InputGroupTextDirective,
    CustomRangeKeyPipe
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangePickerComponent implements OnInit, OnDestroy, ControlValueAccessor, AfterViewInit, OnChanges {
  constructor(private breakpointObserver: BreakpointObserver) {}

  /**
   * Set the format of day name.
   * @default 'numeric'
   * @type DayFormatType
   */
  @Input() dayFormat: DayFormatType = 'numeric';

  /**
   * The number of calendars that render on desktop devices.
   * @type number
   * @default 2
   */
  @Input({ transform: numberAttribute }) calendars: number = 2;

  /**
   * Toggle visibility or set the content of the cleaner button.
   * @type boolean
   * @default true
   */
  @Input({ transform: booleanAttribute }) cleaner = true;

  /**
   * Determine if the dropdown should be closed after value setting.
   * @type boolean
   * @default false
   */
  @Input({ transform: booleanAttribute }) closeOnSelect: boolean = false;

  /**
   * Set date format.
   * We use Angular formatDate() function, see:
   * - https://angular.io/api/common/formatDate
   * - https://angular.io/api/common/DatePipe#pre-defined-format-options
   */
  @Input()
  format?: string;

  /**
   * Toggle visibility or set the content of the input indicator.
   * @type boolean
   * @default true
   */
  @Input({ transform: booleanAttribute }) indicator: boolean = true;

  /**
   * Custom function to format the selected date into a string according to a custom format.
   * @since v5.0.0
   */
  @Input() inputDateFormat?: (date: Date) => string;

  /**
   * Custom function to parse the input value into a valid Date object.
   * @since v5.0.0
   */
  @Input() inputDateParse?: (date: string | Date) => Date;

  /**
   * Toggle the readonly state for the component.
   * @type boolean
   * @default false
   */
  @Input({ transform: booleanAttribute })
  set inputReadOnly(value: boolean) {
    this.#inputReadOnly = value;
  }

  get inputReadOnly(): boolean {
    return this.#inputReadOnly || typeof this.format === 'string';
  }

  #inputReadOnly: boolean = false;

  /**
   * Reorder year-month navigation, and render year first.
   * @type boolean
   * @default false
   */
  @Input({ transform: booleanAttribute }) navYearFirst: boolean = false;

  /**
   * Specifies short hints that are visible in start date and end date inputs.
   * type string
   */
  @Input() placeholder: string | string[] = ['Start date', 'End date'];

  /**
   * Predefined date ranges the user can select from.
   * @type ICalendarRanges
   */
  @Input() ranges?: ICalendarRanges;

  /**
   * Sets the color context of the cancel button to one of CoreUI’s themed colors.
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   * @default 'secondary'
   */
  @Input() rangesButtonsColor: Colors = 'secondary';

  /**
   * Size the ranges button small or large.
   * @type 'sm' | 'lg' | ''
   */
  @Input() rangesButtonsSize: 'sm' | 'lg' | '' = '';

  /**
   * Set the ranges button variant to an outlined button or a ghost button.
   * @type 'outline' | 'ghost' | undefined
   */
  @Input() rangesButtonsVariant?: 'outline' | 'ghost' = 'ghost';

  /**
   * Default icon or character that separates two dates.
   * @type boolean
   * @default true
   */
  @Input({ transform: booleanAttribute }) separator = true;

  /**
   * Size the component small or large.
   * @type 'sm' | 'lg' | undefined
   * @default undefined
   */
  @Input() size?: 'sm' | 'lg';

  /**
   * Provide an additional time selection by adding select boxes to choose time.
   * @type boolean
   * @default false
   */
  @Input({ transform: booleanAttribute })
  set timepicker(value: boolean) {
    this.#timepicker = value;
  }

  get timepicker(): boolean {
    return false;
    // return this.#timepicker;
  }

  #timepicker: boolean = false;

  /**
   * Toggle visual validation feedback.
   * @type boolean | undefined
   * @default undefined
   */
  @Input() valid?: boolean = undefined;

  /**
   * Toggle the visibility of the dropdown date-picker component.
   * @type boolean
   * @default false
   */
  @Input({ transform: booleanAttribute }) visible: boolean = false;

  readonly startDateModel: ModelSignal<Date | null | undefined> = model<Date | null | undefined>(undefined, {
    alias: 'startDate'
  });

  readonly dateModelEffect = effect(() => {
    this.dateRangeGroup.patchValue({ startDateInput: this.startDateValue(), endDateInput: this.endDateValue() });
  });

  readonly startDateChange = outputToObservable(this.startDateModel);

  readonly startDate = computed(() => {
    const prevDate = this.#startDate ? new Date(<Date>this.#startDate) : null;
    const currDate = this.startDateModel() ? new Date(<Date>this.startDateModel()) : null;
    if (prevDate?.getTime() !== currDate?.getTime()) {
      return currDate;
    }
    return prevDate;
  });

  #startDate: Date | null = null;

  public readonly endDateModel: ModelSignal<Date | null | undefined> = model<Date | null | undefined>(undefined, {
    alias: 'endDate'
  });

  readonly endDateChange = outputToObservable(this.endDateModel);

  readonly endDate = computed(() => {
    const prevDate = this.#endDate ? new Date(<Date>this.#endDate) : null;
    const currDate = this.endDateModel() ? new Date(<Date>this.endDateModel()) : null;
    if (prevDate?.getTime() !== currDate?.getTime()) {
      return currDate;
    }
    return prevDate;
  });

  #endDate: Date | null = null;

  @Input({ transform: dateTransform }) calendarDate: Date = new Date();
  @Input() disabledDates: Date[] | Date[][] = [];

  /**
   * Set first day of week.
   * @type number
   * @default 1 (Monday)
   */
  @Input({ transform: numberAttribute }) firstDayOfWeek: number = 1;

  readonly locale = input('default');

  @Input() maxDate: Date | null = null;
  @Input() minDate: Date | null = null;

  /**
   * Show calendar navigation.
   * @type boolean
   * @default true
   */
  @Input({ transform: booleanAttribute }) navigation = true;

  /**
   * Allow range selection.
   * @type boolean
   * @default false
   */
  @Input({ transform: booleanAttribute }) range = true;

  @Input() dateFilter?: DateFilterType;

  @Input({ transform: booleanAttribute })
  set disabled(value: boolean) {
    this.#disabled = value;
    this.#disabled ? this.dateRangeGroup.disable() : this.dateRangeGroup.enable();
  }

  get disabled(): boolean {
    return this.#disabled;
  }

  #disabled = false;

  @Input()
  set value(value: any) {
    const newValue = this.range ? { ...value } : value;
    if (JSON.stringify(this._value) !== JSON.stringify(newValue)) {
      this._value = newValue;
      this.onChange(newValue);
      this.onTouched();
      this.valueChange.emit(this.value);
      // this.dateRangeGroup.setValue({ startDateInput: this.startDateValue(), endDateInput: this.endDateValue() });
      if (this.closeOnSelect) {
        const hasValue = this.range ? !!(this.value.startDate && this.value.endDate) : !!this.value;
        this.visible = !hasValue;
      }
    }
  }

  get value() {
    return this._value;
  }

  private _value: any = {};

  /**
   * Set length or format of day name.
   * @type WeekdayFormatType
   * @default 'short'
   */
  @Input() weekdayFormat: WeekdayFormatType = 'short';

  /**
   * Optional popper Options object
   * @type Partial<Options>
   */
  @Input('popperOptions') popperjsOptions: Partial<Options> = {
    strategy: 'absolute'
  };

  /**
   * Set whether days in adjacent months shown before or after the current month are selectable. This only applies if the `showAdjacentDays` option is set to true.
   * @type boolean
   * @default false
   * @since 4.4.10
   */
  @Input({ transform: booleanAttribute }) selectAdjacentDays: boolean = false;

  /**
   * Set whether to display dates in adjacent months (non-selectable) at the start and end of the current month.
   * @type boolean
   * @default true
   * @since 4.4.10
   */
  @Input({ transform: booleanAttribute }) showAdjacentDays: boolean = true;

  /**
   * Specify the type of date selection as day, week, month, or year.
   * @type 'day' | 'week' | 'month' | 'year'
   * @default 'day'
   * @since 5.0.0
   */
  @Input() selectionType: 'day' | 'week' | 'month' | 'year' = 'day';

  /**
   * Set whether to display week numbers in the calendar.
   * @type boolean
   * @default false
   * @since 5.0.0
   */
  @Input({ transform: booleanAttribute }) showWeekNumber: boolean = false;

  /**
   * Label displayed over week numbers in the calendar.
   * @type string
   * @default undefined
   * @since 5.0.0
   */
  @Input() weekNumbersLabel?: string;

  @Output() readonly valueChange = new EventEmitter<Date | Date[] | undefined>();

  @Output() calendarCellHover: EventEmitter<Date | null> = new EventEmitter<Date | null>();
  @Output() calendarDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  // @Output() endDateChange: EventEmitter<Date | null> = new EventEmitter<Date | null>();
  // @Output() startDateChange: EventEmitter<Date | null> = new EventEmitter<Date | null>();
  // readonly endDateChange = output<Date | null>();
  // readonly startDateChange = output<Date | null>();

  // @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;
  @ViewChild('startDateElementRef') startDateElementRef!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateElementRef') endDateElementRef!: ElementRef<HTMLInputElement>;

  templates: any = {};
  @ContentChildren(TemplateIdDirective, { descendants: true }) contentTemplates!: QueryList<TemplateIdDirective>;

  protected dateChangeSubscriptions: Subscription[] = [];

  protected subscribeDateChange(subscribe: boolean = true): void {
    if (subscribe) {
      // todo
      // this.dateChangeSubscriptions.push(
      //   this.startDateChange.subscribe((next) => {
      //     // console.log('startDateChange', next);
      //     // this.startDate = next;
      //     // this.onChange(next);
      //   })
      // );
      // this.dateChangeSubscriptions.push(
      //   this.endDateChange.subscribe((next) => {
      //     // console.log('endDateChange', next);
      //     // this.endDate = next;
      //     // this.onChange(next);
      //   })
      // );
      return;
    }
    this.dateChangeSubscriptions.forEach((subscription) => {
      subscription?.unsubscribe();
    });
  }

  @HostListener('focusout') onBlur() {
    this.onTouched();
  }

  public isMobile = true;
  public customRanges!: TCustomRange[];
  public showRanges: boolean = false;

  startDateValue = computed(() => {
    const locale = this.locale() ?? 'default';
    const dateFormatted = this.formatDate(this.startDate());
    this.#startDate = this.startDate();
    return dateFormatted;
  });

  endDateValue = computed(() => {
    const locale = this.locale() ?? 'default';
    const dateFormatted = this.formatDate(this.endDate());
    this.#endDate = this.endDate();
    return dateFormatted;
  });

  public get startDatePlaceholder(): string {
    return Array.isArray(this.placeholder) ? this.placeholder[0] : this.placeholder;
  }

  public get endDatePlaceholder(): string {
    return Array.isArray(this.placeholder) ? this.placeholder[1] : this.placeholder;
  }

  private layoutChanges!: Subscription;

  // todo: validation
  // startDateInput = new FormControl({ value: this.startDateValue, disabled: this.disabled }, [
  //   Validators.required
  //   // Validators.minLength(8),
  //   // Validators.maxLength(10),
  //   // invalidDateStringValidator(this.locale)
  // ]);
  // endDateInput = new FormControl({ value: this.endDateValue, disabled: this.disabled }, [
  //   Validators.required
  //   // Validators.minLength(8),
  //   // Validators.maxLength(10),
  //   // invalidDateStringValidator(this.locale)
  // ]);
  dateRangeGroup: FormGroup = new FormGroup({
    startDateInput: new FormControl({ value: '', disabled: this.disabled }, [Validators.required]),
    endDateInput: new FormControl({ value: '', disabled: this.disabled }, [Validators.required])
  });

  set inputStartHoverValue(value) {
    this._inputStartHoverValue = value;
  }

  get inputStartHoverValue() {
    return this._inputStartHoverValue;
  }

  private _inputStartHoverValue!: Date | null;

  set inputEndHoverValue(value) {
    this._inputEndHoverValue = value;
  }

  get inputEndHoverValue() {
    return this._inputEndHoverValue;
  }

  private _inputEndHoverValue!: Date | null;

  @HostBinding('class')
  get datePickerClasses() {
    return {
      'date-picker': true,
      [`date-picker-${this.size}`]: this.size,
      disabled: this.disabled,
      'is-valid': this.valid === true,
      'is-invalid': this.valid === false
    };
  }

  formatDate(date: Date | null | undefined) {
    return !date || !isValidDate(date)
      ? ''
      : typeof this.inputDateFormat === 'function'
        ? this.inputDateFormat(date)
        : !!this.format && !!this.locale() && this.locale() !== 'default'
          ? formatDate(date, this.format, this.locale())
          : this.timepicker
            ? date.toLocaleString(this.locale())
            : date.toLocaleDateString(this.locale());
  }

  readonly #breakpoints = {
    OneCalendarRanges: '(min-width: 480px)',
    TwoCalendars: '(max-width: 650px)',
    TwoCalendarsRanges: '(max-width: 810px)'
  };

  ngOnInit(): void {
    this.customRanges = this.ranges ? Object.entries(this.ranges) : [];

    const breakpoints = this.#breakpoints;

    this.layoutChanges = this.breakpointObserver
      .observe([breakpoints.OneCalendarRanges, breakpoints.TwoCalendars, breakpoints.TwoCalendarsRanges])
      .subscribe((result) => {
        if (result.matches) {
          this.isMobile =
            (this.customRanges?.length > 0 && result.breakpoints[breakpoints.TwoCalendarsRanges]) ||
            result.breakpoints[breakpoints.TwoCalendars];
          if (this.customRanges?.length > 0) {
            this.showRanges = !result.breakpoints[breakpoints.OneCalendarRanges];
          }
        }
      });

    this.subscribeDateChange();
  }

  ngOnDestroy() {
    this.layoutChanges?.unsubscribe();
    this.subscribeDateChange(false);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.contentTemplates.forEach((child: TemplateIdDirective) => {
        this.templates[child.id] = child.templateRef;
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date']) {
      // for date-picker component
      const date = this.convertValueToDate(changes['date']?.currentValue) ?? null;
      this.handleStartDateChange(date);
      this.calendarDate = date ?? this.calendarDate;
    }
    if (changes['startDate']) {
      const date = this.convertValueToDate(changes['startDate']?.currentValue) ?? null;
      this.handleStartDateChange(date);
      this.calendarDate = date ?? this.calendarDate;
    }
    if (changes['endDate']) {
      const date = this.convertValueToDate(changes['endDate']?.currentValue) ?? null;
      this.handleEndDateChange(date);
    }
  }

  convertValueToDate(value: Date | string | number | undefined | null) {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      return this.inputParse(value) ?? null;
    }
    return new Date(value);
  }

  inputParse(date: string) {
    if (typeof this.inputDateParse === 'function') {
      const parsedDate = this.inputDateParse(date);
      if (isValidDate(parsedDate)) {
        return parsedDate;
      }
    }
    return getLocalDateFromString(date, this.locale(), this.timepicker);
  }

  getCustomRangeKey(customRange: any) {
    return customRange[0];
  }

  setCustomRange(customRange: any) {
    const key = this.getCustomRangeKey(customRange);
    this.handleStartDateChange(customRange[1][0]);
    this.handleEndDateChange(customRange[1][1]);
  }

  handleCalendarCellHover($event: Date | null) {
    this.calendarCellHover.emit($event);
    if (!this.startDate()) {
      this.setInputValue(this.startDateElementRef, $event);
      this.inputStartHoverValue = $event;
      this.setInputValue(this.endDateElementRef, null);
      this.inputEndHoverValue = null;
      return;
    }
    if (!this.endDate()) {
      this.setInputValue(this.endDateElementRef, $event);
      this.inputEndHoverValue = $event;
      return;
    }
  }

  handleCalendarDateChange($event: Date) {
    if (this.calendarDate.getTime() !== $event.getTime()) {
      this.calendarDateChange.emit($event);
    }
  }

  handleStartDateChange(date: Date | null) {
    this.startDateModel.set(date ?? null);
    this.dateRangeGroup.patchValue({ startDateInput: this.startDateValue() });
    this.inputStartHoverValue = null;
    this.value = this.range ? { startDate: this.startDate(), endDate: this.endDate() } : this.startDate();
  }

  handleEndDateChange(date: Date | null) {
    if (!this.range) {
      return;
    }
    this.endDateModel.set(date ?? null);
    this.dateRangeGroup.patchValue({ endDateInput: this.endDateValue() });
    this.inputEndHoverValue = null;
    this.value = this.range ? { startDate: this.startDate(), endDate: this.endDate() } : this.startDate();
  }

  handleClear($event?: MouseEvent) {
    // this.calendarComponent.clearDates();
    this.handleStartDateChange(null);
    this.handleEndDateChange(null);
  }

  handleStartDateInputChange($event: any) {
    const inputValue = ($event.target as HTMLInputElement).value;
    const date = this.inputParse(inputValue);
    if (!date) {
      // this.calendarComponent.clearDates();
      this.handleStartDateChange(null);
      this.handleEndDateChange(null);
      return;
    }
    if (date instanceof Date && date.getTime()) {
      // @ts-ignore
      if (!(this.forbiddenDate(date) || (this.endDate() && this.endDate() < date))) {
        this.calendarDate = date;
        this.handleStartDateChange(date);
      }
    }
    this.handleStartDateChange(this.startDate() ?? null);
  }

  handleEndDateInputChange($event: any) {
    const inputValue = ($event.target as HTMLInputElement).value;
    const date = this.inputParse(inputValue);
    if (!date) {
      this.handleEndDateChange(null);
      return;
    }
    if (date instanceof Date && date.getTime()) {
      // @ts-ignore
      if (!(this.forbiddenDate(date) || (this.startDate() && this.startDate() > date))) {
        this.calendarDate = date;
        this.handleEndDateChange(date);
      } else {
        this.handleEndDateChange(null);
      }
    }
    this.handleEndDateChange(this.endDate() ?? null);
  }

  forbiddenDate(date: Date) {
    return (
      isDateDisabled(date, this.minDate, this.maxDate, this.disabledDates) ||
      (this.dateFilter ? !this.dateFilter(date) : false)
    );
  }

  setInputValue = (elementRef: ElementRef, date: Date | null) => {
    if (!elementRef) {
      return;
    }
    elementRef.nativeElement.value = this.formatDate(date);
    // elementRef.nativeElement.valueAsDate = date;
    return;
  };

  onChange: any = (value: any) => {
    /* empty */
  };
  onTouched: any = () => {
    /* empty */
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    if (!!value) {
      this.handleStartDateChange(this.range ? value.startDate : value);
      this.handleEndDateChange(this.range ? value.endDate : null);
    }
  }

  handleStartTimeChange(time: Date | undefined) {
    this.startDateModel.set(time ?? this.startDate());
  }

  handleEndTimeChange(time: Date | undefined) {
    if (!this.range) {
      return;
    }
    this.endDateModel.set(time ?? this.endDate());
  }
}
