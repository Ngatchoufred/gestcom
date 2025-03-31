import { Pipe, PipeTransform } from '@angular/core';
import { IColumn } from '../smart-table.type';
import { getColumnLabel } from '../smart-table.utils';

@Pipe({
  name: 'columnLabel',
  standalone: true
})
export class SmartTableColumnLabelPipe implements PipeTransform {

  transform(column: IColumn | string, ...args: unknown[]): unknown {
    return getColumnLabel(column);
  }

}
