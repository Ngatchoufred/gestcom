import { Pipe, PipeTransform } from '@angular/core';
import { convertToDateObject, isDateDisabled } from '../calendar.utils';

@Pipe({
  name: 'calendarClassRow',
  standalone: true
})
export class CalendarClassRowPipe implements PipeTransform {

  transform(week: { weekNumber: number; days: { date: Date, month: string }[]; }, datesConfig?: {
    minDate: any;
    maxDate: any;
    disabledDates: any;
    dateFilter: any;
    calendarDate: any;
    selectionType: any
  }) {

    const { minDate, maxDate, disabledDates, dateFilter, calendarDate, selectionType } = { ...datesConfig };

    const date = convertToDateObject(
      week.weekNumber === 0
      ? `${calendarDate.getFullYear()}W53`
      : `${calendarDate.getFullYear()}W${week.weekNumber}`,
      selectionType
    );
    const isDisabled = isDateDisabled(date, minDate, maxDate, disabledDates) || (dateFilter ? !dateFilter(date) : false);

    return {
      'calendar-row': true,
      disabled: isDisabled
    };
  }

}
