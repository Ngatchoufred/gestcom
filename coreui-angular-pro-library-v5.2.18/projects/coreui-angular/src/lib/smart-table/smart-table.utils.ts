import { IColumn, IGroup, IItem, ISorter } from './smart-table.type';

export const getClickedColumnName = (target: HTMLTextAreaElement, columnNames: string[], selectable: boolean): string => {
  const closest = target.closest('tr');
  const children = closest ? Array.from(closest.children) : [];
  const clickedCell = children.filter((child) => child.contains(target))[0];
  return columnNames[children.indexOf(clickedCell) - (selectable ? 1 : 0)];
};

export const getColumnKey = (column: IColumn | string) => typeof column === 'object' ? column.key : column;

export const getColumnLabel = (column: IColumn | string) =>
  typeof column === 'object' && column.label !== undefined ? column.label : prettifyName(getColumnKey(column));

export const getColumnName = getColumnKey;

export const getColumnNames = (columns: (string | IColumn)[] | undefined, items: IItem[]): string[] => {
  if (columns?.length) {
    const _columns: string[] = [];

    for (const column of columns) {
      if (typeof column === 'object' && column.children) {
        _columns.push(...getColumnNames(column.children, []));
        continue;
      }

      typeof column === 'object' ? _columns.push(column.key) : _columns.push(column);
    }

    return _columns;
  }

  return getColumnNamesFromItems(items);
};

export const getColumns = (_columns: (IColumn | IGroup)[]): (IColumn)[] => {
  const columns: IColumn[] = [];

  for (const column of _columns) {
    if (typeof column === 'object' && column.group && column.children) {
      columns.push(...getColumns(column.children));
      continue;
    }

    if (typeof column === 'object' && column.children) {
      columns.push(...getColumns(column.children));
    }

    columns.push(column);
  }

  return columns;
};

export const countColumns = (columns: IColumn[], counter = 0) => {
  let _counter = counter;
  for (const column of columns) {
    if (!column.children) {
      _counter++;
    }

    if (column.children) {
      _counter = countColumns(column.children, _counter);
    }
  }

  return _counter;
};

export const getColumnGroups = (columns: (string | IColumn)[] | undefined) => {
  const groups = [];

  const traverseColumns = (column: IColumn, deep = 0, colSpan = 0): IGroup[] => {
    const groups = [];

    if (column.children) {
      for (const _column of column.children) {
        if (!_column.group) {
          colSpan++;
        }
        groups.push(...traverseColumns(_column, deep + 1, colSpan));
      }
    }

    if (typeof column === 'object' && column.group) {
      const { children, group, ...rest } = column;
      groups.push({
        deep: deep, label: group, ...(children && { colspan: countColumns(children) }), ...rest
      });
    }

    return groups;
  };

  if (columns) {
    for (const column of columns) {
      if (typeof column === 'object' && column.group) {
        const objects = traverseColumns(column);

        if (objects) {
          for (const object of objects) {
            const { deep, ...rest } = object;

            if (deep === undefined) {
              continue;
            }

            for (let i = 0; i < deep; i++) {
              if (groups[i]) {
                continue;
              }

              groups.push([]);
            }

            if (groups[deep]) {
              groups[deep].push(rest);
            } else {
              groups.push([rest]);
            }
          }
        }
      }
    }
  }
  return groups as IGroup[][];
};

export const getColumnNamesFromItems = (items: IItem[]) => Object.keys(items[0] || {}).filter((el) => el.charAt(0) !== '_');

export const getColumnValues = (items: IItem[], key: string) => {
  return items.map((item) => item[key]);
};

export const convertNgClassToObj = (value: string | string[] | Set<string> | { [klass: string]: any; } | null | undefined): { [klass: string]: boolean; } => {

  const WS_REGEXP = /\s+/;
  const rawClass = typeof value === 'string' ? value.trim().split(WS_REGEXP) : value;
  const objClass: { [klass: string]: boolean; } = {};

  if (Array.isArray(rawClass) || rawClass instanceof Set) {
    for (const klass of rawClass) {
      objClass[klass] = true;
    }
    return objClass;
  }
  return rawClass ?? {};
};

export const getTableDataCellClass = (column: IColumn, item: IItem) => {

  const colClass = convertNgClassToObj(column?._colClass ?? {});
  const rowClass = convertNgClassToObj(item._class ?? {});
  const allClass = convertNgClassToObj(item._cellClass?._all ?? {});
  const cellClass = convertNgClassToObj(item._cellClass?.[column.key] ?? {});
  return { ...colClass, ...rowClass, ...allClass, ...cellClass };
};

export const getTableDataCellProps = (column: IColumn, item: IItem) => {
  const props = {};

  if (typeof column === 'object' && column._colProps) {
    Object.assign(props, column._colProps);
  }

  if (item._cellProps?._all) {
    Object.assign(props, item._cellProps._all);
  }

  if (item._cellProps?.[column.key]) {
    Object.assign(props, item._cellProps[column.key]);
  }

  return props;
};

export const getTableDataCellStyles = (column: IColumn, item: IItem): Partial<CSSStyleDeclaration> => {
  const styles: Partial<CSSStyleDeclaration> = {};

  if (typeof column === 'object' && column._colStyle) {
    Object.assign(styles, column._colStyle);
  }

  if (item._cellStyle?._all) {
    Object.assign(styles, item._cellStyle._all);
  }

  // @ts-ignore
  if (item._cellStyle?.[column.key]) {
    // @ts-ignore
    Object.assign(styles, item._cellStyle[column.key]);
  }
  return { ...styles };
};

export const getTableHeaderCellProps = (column: IColumn | string) => {
  if (typeof column === 'object' && column._props) {
    const { color, ...props } = { ...column._props };
    return props;
  }

  return {};
};

export const getTableHeaderCellClass = (column: IColumn) => {
  const headerClass = convertNgClassToObj(column?._classes ?? {});
  return { ...headerClass };
};

export const getTableHeaderCellStyles = (
  column: IColumn,
  columnSorter: boolean | ISorter | undefined
): Partial<CSSStyleDeclaration> => {

  const style: Partial<CSSStyleDeclaration> = {
    verticalAlign: 'middle',
    overflow: 'hidden',
    cursor: columnSorter ? 'pointer' : ''
  };

  if (typeof column === 'object' && column._style) {
    return { ...style, ...column._style };
  }
  return { ...style };
};

export const prettifyName = (name: string) => {
  return name
    .replace(/[-_.]/g, ' ')
    .replace(/ +/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
