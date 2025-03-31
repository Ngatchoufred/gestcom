import { SelectionType } from './calendar.service';

export function dateTransform(value: Date | number) {
  return tryDate(value, 'dateTransform');
}

export const convertIsoWeekToDate = (isoWeek: string) => {
  const [year, week] = isoWeek.split(/w/i);
  // Get date for 4th of January for year
  const date = new Date(Number(year), 0, 4);
  // Get previous Monday, add 7 days for each week after first
  date.setDate(date.getDate() - (date.getDay() || 7) + 1 + (Number(week) - 1) * 7);
  return date;
};

export const convertToDateObject = (
  date: Date | string,
  selectionType?: SelectionType
) => {

  if (date instanceof Date) {
    return date;
  }

  if (selectionType === 'week') {
    return convertIsoWeekToDate(date as string);
  }

  return new Date(Date.parse(date));
};

export const convertToLocalDate = (d: Date, locale: string, options = {}) =>
  d.toLocaleDateString(locale, options);

export const convertToLocalTime = (d: Date, locale: string, options = {}) =>
  d.toLocaleTimeString(locale, options);

export const createGroupsInArray = <T>(arr: T[], numberOfGroups: number): T[][] => {
  const perGroup = Math.ceil(arr.length / numberOfGroups);
  return Array.from({ length: numberOfGroups })
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
};

export const getCalendarDate = (calendarDate: Date, order: number, view: 'days' | 'months' | 'years') => {
  if (order !== 0 && view === 'days') {
    return new Date(Date.UTC(calendarDate.getFullYear(), calendarDate.getMonth() + order, 1));
  }

  if (order !== 0 && view === 'months') {
    return new Date(Date.UTC(calendarDate.getFullYear() + order, calendarDate.getMonth(), 1));
  }

  if (order !== 0 && view === 'years') {
    return new Date(Date.UTC(calendarDate.getFullYear() + (12 * order), calendarDate.getMonth(), 1));
  }

  return calendarDate;
};

export const getCurrentYear = () => new Date().getFullYear();

export const getCurrentMonth = () => new Date().getMonth();

export const getDateBySelectionType = (
  date: Date | null,
  selectionType: SelectionType
) => {
  if (date === null) {
    return null;
  }

  if (selectionType === 'week') {
    return `${date.getFullYear()}W${getWeekNumber(date)}`;
  }

  if (selectionType === 'month') {
    const monthNumber = `0${date.getMonth() + 1}`.slice(-2);
    return `${date.getFullYear()}-${monthNumber}`;
  }

  if (selectionType === 'year') {
    return `${date.getFullYear()}`;
  }

  return date;
};

//

export const getLocalDateFromString = (string: string, locale: string, time?: boolean) => {
  const date = new Date(2013, 11, 31, 17, 19, 22);
  let regex = time ? date.toLocaleString(locale) : date.toLocaleDateString(locale);
  regex = regex
    .replace('2013', '(?<year>[0-9]{2,4})')
    .replace('12', '(?<month>[0-9]{1,2})')
    .replace('31', '(?<day>[0-9]{1,2})');

  if (time) {
    regex = regex
      .replace('5', '(?<hour>[0-9]{1,2})')
      .replace('17', '(?<hour>[0-9]{1,2})')
      .replace('19', '(?<minute>[0-9]{1,2})')
      .replace('22', '(?<second>[0-9]{1,2})')
      .replace('PM', '(?<ampm>[A-Z]{2})');
  }

  const rgx = RegExp(`${regex}`);
  const partials = string.match(rgx);

  if (partials === null) {
    return;
  }

  const newDate = partials.groups && (time ? new Date(Number(partials.groups['year']), Number(partials.groups['month']) - 1, Number(partials.groups['day']), partials.groups['ampm'] ? partials.groups['ampm'] === 'PM' ? Number(partials.groups['hour']) + 12 : Number(partials.groups['hour']) : Number(partials.groups['hour']), Number(partials.groups['minute']), Number(partials.groups['second'])) : new Date(Number(partials.groups['year']), Number(partials.groups['month']) - 1, Number(partials.groups['day'])));

  return newDate;
};

export const getMonthName = (month: number, locale: string) => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(month);
  return d.toLocaleString(locale, { month: 'long' });
};

export const getMonthsNames = (locale: string, year: number) => {
  const months = [];
  const d = new Date(year);
  d.setDate(1);

  for (let i = 0; i < 12; i++) {
    d.setMonth(i);
    months.push({ year, month: d.toLocaleDateString(locale, { month: 'short' }) });
  }

  return months;
};

export const getYears = (year: number) => {
  const years = [];
  for (let _year = year - 6; _year < year + 6; _year++) {
    years.push(_year);
  }

  return years;
};

const getLeadingDays = (year: number, month: number, firstDayOfWeek: number) => {
  // 0: sunday
  // 1: monday
  const dates = [];
  const d = new Date(year, month);
  const y = d.getFullYear();
  const m = d.getMonth();
  const firstWeekday = new Date(y, m, 1).getDay();
  let leadingDays = 6 - (6 - firstWeekday) - firstDayOfWeek;

  if (firstDayOfWeek) {
    leadingDays = leadingDays < 0 ? 7 + leadingDays : leadingDays;
  }

  for (let i = leadingDays * -1; i < 0; i++) {
    dates.push({
      date: new Date(y, m, i + 1), month: 'previous'
    });
  }

  return dates;
};

const getMonthDays = (year: number, month: number) => {
  const dates = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    dates.push({
      date: new Date(year, month, i), month: 'current'
    });
  }
  return dates;
};

const getTrailingDays = (
  year: number,
  month: number,
  leadingDays: { date: Date; month: string }[],
  monthDays: { date: Date; month: string }[]
) => {
  const dates = [];
  const days = 42 - (leadingDays.length + monthDays.length);
  for (let i = 1; i <= days; i++) {
    dates.push({
      date: new Date(year, month + 1, i), month: 'next'
    });
  }
  return dates;
};

export const getDayNumber = (date: Date) =>
  Math.ceil((Number(date) - Number(new Date(date.getFullYear(), 0, 0))) / 1000 / 60 / 60 / 24);

export const getWeekNumber = (date: Date) => {
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7));
};

export const getMonthDetails = (year: number, month: number, firstDayOfWeek: number) => {
  const daysPrevMonth = getLeadingDays(year, month, firstDayOfWeek);
  const daysThisMonth = getMonthDays(year, month);
  const daysNextMonth = getTrailingDays(year, month, daysPrevMonth, daysThisMonth);
  const days = [...daysPrevMonth, ...daysThisMonth, ...daysNextMonth];

  const weeks: { weekNumber: number; days: { date: Date; month: string }[] }[] = [];

  days.forEach((day, index) => {
    if (index % 7 === 0 || weeks.length === 0) {
      weeks.push({ weekNumber: -1, days: [] });
    }

    if ((index + 1) % 7 === 0) {
      weeks[weeks.length - 1].weekNumber = getWeekNumber(day.date);
    }

    weeks[weeks.length - 1].days.push(day);
  });

  return [...weeks];
};

export const isDateDisabled = (date: Date | null, min?: Date | null, max?: Date | null, dates?: (Date | Date[])[]) => {
  if (!date) {
    return false;
  }
  if (!min && !max && (!dates || !dates.length)) {
    return false;
  }
  if (min && date < min) {
    return true;
  }
  if (max && date > max) {
    return true;
  }

  let disabled = false;
  if (dates) {
    for (const _date of dates) {
      if (Array.isArray(_date)) {
        if (isDateInRange(date, _date[0], _date[1])) {
          disabled = true;
          break;
        }
      }
      if (_date instanceof Date) {
        if (isSameDateAs(date, _date)) {
          disabled = true;
          break;
        }
      }
    }
  }

  return disabled;
};

export const isDateInRange = (date: Date | null, start: Date | null, end: Date | null) => {
  return date && start && end && start <= date && date <= end;
};

export const isYearInRange = (date: Date | null, start: Date | null, end: Date | null) => {
  return date && start && end && start.getFullYear() <= date.getFullYear() && date.getFullYear() <= end.getFullYear();
};

export const isDateBetweenMinMax = (date: Date | null, min: Date | null, max: Date | null) => {
  if (date && min && max) {
    return min <= date && date <= max;
  }
  if (date && min) {
    return min <= date;
  }
  if (date && max) {
    return date <= max;
  }
  return true;
};

export const isDateSelected = (date: Date | null, start: Date | null, end: Date | null) => {
  return date && ((start && isSameDateAs(start, date)) || (end && isSameDateAs(end, date)));
};

export const isMonthSelected = (date: Date | null, start: Date | null, end: Date | null) => {
  return date && ((start && isSameMonthAs(start, date)) || (end && isSameMonthAs(end, date)));
};

export const isYearSelected = (date: Date | null, start: Date | null, end: Date | null) => {
  return date && ((start && isSameYearAs(start, date)) || (end && isSameYearAs(end, date)));
};

export const isEndDate = (date: Date | null, start: Date | null, end: Date | null) => {
  return date && start && end && isSameDateAs(end, date) && start < end;
};

export const isLastDayOfMonth = (date: Date) => {
  const test = new Date(date.getTime());
  const month = test.getMonth();

  test.setDate(test.getDate() + 1);
  return test.getMonth() !== month;
};

export const isSameDateAs = (date: Date, date2: Date) => {
  return (date.getDate() == date2.getDate() && date.getMonth() == date2.getMonth() && date.getFullYear() == date2.getFullYear());
};

export const isSameMonthAs = (date: Date, date2: Date) => {
  return (date.getMonth() == date2.getMonth() && date.getFullYear() == date2.getFullYear());
};

export const isSameYearAs = (date: Date, date2: Date) => {
  return (date.getFullYear() == date2.getFullYear());
};

export const isStartDate = (date: Date | null, start: Date | null, end: Date | null) => {
  return date && start && end && isSameDateAs(start, date) && start < end;
};

export const isToday = (date: Date) => {
  const today = new Date();
  return (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear());
};

export const isThisMonth = (date: Date, index: number) => {
  const today = new Date();
  return (index == today.getMonth() && date.getFullYear() == today.getFullYear());
};

export const isThisYear = (year: number) => {
  const today = new Date();
  return (year == today.getFullYear());
};

export const isValidDate = (date: number | string | Date): boolean => {

  if (date instanceof Date || typeof date === 'number' || typeof date === 'string') {
    // Try to create a Date object from Date or timestamp or string
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }

  // If none of the above conditions are met, it's not a valid date
  return false;
};

export const tryDate = (value: string | number | Date, propName: string = 'date') => {
  let _value;
  try {
    if (!isValidDate(value)) {
      throw value;
    }
    _value = new Date(value);
  } catch (err) {
    console.warn(`Invalid ${propName}`, err);
    _value = new Date();
    _value.setHours(0, 0, 0, 0);
  }
  return _value;
};

export const isDateInRangeDisabled = (startDate?: Date | null, endDate?: Date | null, dates?: (Date | Date[])[]) => {
  if (!dates || !dates.length) {
    return false;
  }
  if (startDate && endDate) {
    const date = new Date(startDate);
    let disabled = false;

    while (date < endDate) {
      date.setDate(date.getDate() + 1);
      if (isDateDisabled(date, null, null, dates)) {
        disabled = true;
        break;
      }
    }
    return disabled;
  }
  return false;
};

// export const stringToDateConvert = (date: string, locales: string) => {
//   const formatter = new Intl.DateTimeFormat('fr-FR');
//   const parts = formatter.formatToParts();
//   console.log(date, parts, formatter.format(), formatter.resolvedOptions(), formatter.format());
// };

// declare namespace Intl {
//   type DateTimeFormatPartTypes = "day" | "dayPeriod" | "era" | "fractionalSecond" | "hour" | "literal" | "minute" | "month" | "second" | "timeZoneName" | "weekday" | "year";
//
//   interface DateTimeFormatPart {
//     type: DateTimeFormatPartTypes;
//     value: string;
//   }
//
//   interface DateTimeFormat {
//     formatToParts(date?: Date | number): DateTimeFormatPart[];
//   }
// }

type DateTimeFormatPartTypes =
  'day'
  | 'dayPeriod'
  | 'era'
  | 'fractionalSecond'
  | 'hour'
  | 'literal'
  | 'minute'
  | 'month'
  | 'second'
  | 'timeZoneName'
  | 'weekday'
  | 'year';
type DateFormatPartTypes = 'day' | 'month' | 'year' | 'literal';

// type DateParts = {
//   [key in DateTimeFormatPartTypes]?: string;
// };

// type DateParts = {
//   year: number, month: number, day: number, literal: string
// };
//
// export const cvtDate = (dateAsString: string, locale = 'pl-PL') => {
//   const dateString = dateAsString ?? new Date().toLocaleDateString(locale);
//   const dateSplit = dateString.split(/[.\-\/\s\D]/gi).filter(item => !!item.length);
//   const formatter = new Intl.DateTimeFormat(locale);
//   const parts = formatter.formatToParts().filter(part => ['year', 'month', 'day'].includes(part.type));
//   const dateShim = {
//     day: undefined, month: undefined, year: undefined
//   };
//   parts.forEach((part, index) => {
//     const { type, value } = { ...part };
//     // @ts-ignore
//     dateShim[type] = dateSplit[index];
//   });
//
//   return dateShim;
//
//   // const dateParts: DateParts = {
//   //   year: 0,
//   //   month: 0,
//   //   day: 0,
//   //   literal: '/'
//   // };
//   //
//   // const literal = parts.find(part => part.type === 'literal')?.value ?? '/';
//   // // const year = parseInt(parts.find(part => part.type === 'year')?.value ?? '0');
//   // // const month = parseInt(parts.find(part => part.type === 'year')?.value ?? '0');
//   // // const day = parseInt(parts.find(part => part.type === 'year')?.value ?? '0');
//   //
//   // const dateArray = dateString.split(literal);
//   //
//   // parts.forEach(part => {
//   //   const {type, value} = {...part};
//   //   if (type === 'day') {
//   //
//   //   }
//   // })
//   //
//   // parts.filter(part => part.type in dateParts).map(part => {
//   //   const {type, value} = {...part};
//   //   // @ts-ignore
//   //   dateParts[type] = parseInt(part.value);
//   //   //
//   //   // switch (type) {
//   //   //   case 'day':
//   //   //     day = parseInt(value);
//   //   //     break;
//   //   //   case 'month':
//   //   //     month = parseInt(value);
//   //   //     break;
//   //   //   case 'year':
//   //   //     year = parseInt(value);
//   //   //     break;
//   //   // }
//   // })
//   // // const { year, month, day } = {...dateParts}
//   // return new Date(year, month - 1, day);
// };
//
// // function getDateX(dateAsString) {
// //   const [day, month, year] = dateAsString.split('/');
// //   return new Date(year, month - 1, day);
// // }
//
// // getDate('12/07/1997');
