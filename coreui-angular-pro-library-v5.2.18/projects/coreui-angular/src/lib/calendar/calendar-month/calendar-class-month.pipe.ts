import { Pipe, PipeTransform } from '@angular/core';
import { isThisMonth } from '../calendar.utils';

@Pipe({
  name: 'calendarClassMonth',
  standalone: true
})
export class CalendarClassMonthPipe implements PipeTransform {

  transform(calendarDate: string | number | Date, monthIndex: number): any {
    const date = new Date(new Date(calendarDate).getFullYear(), monthIndex, 1);

    return {
      'calendar-cell': true,
      month: true,
      today: isThisMonth(date, monthIndex)
    };
  }
}
