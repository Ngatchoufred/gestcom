import { ChangeDetectionStrategy, Component, forwardRef, Input, model, output } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';

import { ButtonDirective } from '../button';
import { DateRangePickerComponent } from '../date-range-picker';
import { CalendarComponent } from '../calendar';
import { DropdownComponent, DropdownMenuDirective, DropdownToggleDirective } from '../dropdown';
import { FormControlDirective, InputGroupComponent, InputGroupTextDirective } from '../form';
import { TimePickerComponent } from '../time-picker';
import { CustomRangeKeyPipe } from '../date-range-picker/date-range-picker/custom-range-key.pipe';

@Component({
  selector: 'c-date-picker',
  templateUrl: '../date-range-picker/date-range-picker/date-range-picker.component.html',
  styleUrls: ['../date-range-picker/date-range-picker/date-range-picker.component.scss'],
  exportAs: 'cDatePicker',
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
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent extends DateRangePickerComponent {
  constructor(breakpointObserver: BreakpointObserver) {
    super(breakpointObserver);
  }

  @Input() override placeholder: string = 'Select date';

  readonly dateChange = output<Date | null | undefined>();

  override readonly range = false;

  override readonly calendars = 1;

  override readonly endDate = model(null);

  @Input()
  set date(value: Date | null | undefined) {
    this.startDateModel.set(value);
  }

  get date() {
    return this.startDate();
  }

  override writeValue(value: Date | null | undefined): void {
    this.date = value;
    super.writeValue(value);
  }

  override subscribeDateChange(subscribe: boolean = true): void {
    if (subscribe) {
      this.dateChangeSubscriptions.push(
        this.startDateChange.subscribe((next) => {
          this.date = next;
          this.onChange(next);
          this.dateChange.emit(this.date);
        })
      );
      return;
    }
    this.dateChangeSubscriptions.forEach((subscription) => {
      subscription?.unsubscribe();
    });
  }
}
