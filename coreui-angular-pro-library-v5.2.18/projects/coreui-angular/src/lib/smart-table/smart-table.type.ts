import { Colors, NgCssClass } from '../coreui.types';
import { TemplateRef } from '@angular/core';
import { ITable, ITableElementProps, ITableRowCellProps } from '../table/table.type';

export interface ISmartTable {
  /**
   * Sets active page. If 'pagination' prop is enabled, activePage is set only initially.
   * @type number
   * @default 1
   */
  activePage?: number;
  /**
   * When set, displays table cleaner above table, next to the table filter (or in place of table filter if `tableFilter` prop is not set)
   * Cleaner resets `tableFilterValue`, `columnFilterValue`, `sorterValue`.
   * If clean is possible it is clickable (`tabIndex="0"` `role="button"`, `color="danger"`), otherwise it is not clickable and transparent.
   * Cleaner can be customized through the `cleaner` slot.
   * @type boolean
   */
  cleaner?: boolean;
  /**
   * Style table items as clickable.
   * @type boolean
   */
  clickableRows?: boolean;
  /**
   * When set, displays additional filter row between table header and items, allowing filtering by specific column.
   * Column filter can be customized, by passing prop as object with additional options as keys. Available options:
   * - external (Boolean) - Disables automatic filtering inside component.
   * - lazy (Boolean) - Set to true to trigger filter updates only on change event.
   * @type boolean | ColumnFilter
   */
  columnFilter?: boolean | IColumnFilter;
  /**
   * Value of table filter. To set pass object where keys are column names and values are filter strings e.g.:
   * { user: 'John', age: 12 }
   */
  columnFilterValue?: IColumnFilterValue;
  /**
   * Prop for table columns configuration. If prop is not defined, table will display columns based on the first item keys, omitting keys that begin with underscore (e.g. '_classes')
   *
   * In columns prop each array item represents one column. Item might be specified in two ways:
   * String: each item define column name equal to item value.
   * Object: item is object with following keys available as column configuration:
   * - key (required)(String) - define column name equal to item key.
   * - label (String) - define visible label of column. If not defined, label will be generated automatically based on column name, by converting kebab-case and snake_case to individual words and capitalization of each word.
   * - _classes (String/Array/Object) - adds classes to all cells in a column
   * - _style (String/Array/Object) - adds styles to the column header (useful for defining widths)
   * - sorter (Boolean) - disables sorting of the column when set to false
   * - filter (Boolean) - removes filter from column when set to false.
   */
  columns?: (string | IColumn)[];
  /**
   * Enables table sorting by column value. Sorting will be performed correctly if values in column are one of type: string (case-insensitive) or number.
   *
   * Sorter can be customized, by passing prop as object with additional options as keys. Available options:
   * - external (Boolean) - Disables automatic sorting inside component.
   * - resettable (Boolean) - If set to true clicking on sorter have three states: ascending, descending and null. That means that third click on sorter will reset sorting, and restore table to original order.
   * @type boolean | Sorter
   */
  columnSorter?: boolean | ISorter;
  /**
   * Displays table footer, which mirrors table header. (without column filter).
   * @default false
   * @type boolean
   */
  footer?: boolean;
  /**
   * Set false to remove table header.
   * @default true
   */
  header?: boolean;
  /**
   * Array of objects, where each object represents one item - row in table. Additionally, you can add style classes to each row by passing them by '_classes' key and to single cell by '_cellClasses'.
   *
   * Example item:
   * { name: 'John' , age: 12, _props: { color: 'success' }, _cellProps: { age: { class: 'fw-bold'}}}
   * For column generation description see columns prop.
   * @type Array<IItem>
   */
  items?: IItem[];
  /**
   * Number of items per site, when pagination is enabled.
   * @default 10
   * @type number
   */
  itemsPerPage?: number;
  /**
   * Label for items per page selector.
   * @default 'Items per page:'
   * @type string
   */
  itemsPerPageLabel?: string;
  /**
   * Items per page selector options.
   * @default [5, 10, 20, 50]
   * @type number[]
   */
  itemsPerPageOptions?: number[];
  /**
   * Adds select element over table, which is used for control items per page in pagination.
   * If you want to customize this element, pass an object with optional values:
   * - external (Boolean) - disables automatic 'itemsPerPage' change (use to change pages externally by 'pagination-change' event).
   */
  itemsPerPageSelect?: boolean | ItemsPerPageSelect;
  /**
   * When set, table will have loading style: loading spinner and reduced opacity.
   * When 'small' prop is enabled spinner will be also smaller.
   * @type boolean
   */
  loading?: boolean;
  /**
   * ReactNode or string for passing custom noItemsLabel texts.
   * @default 'No items found'
   */
  noItemsLabel?: string | TemplateRef<any>;
  /**
   * Enables default pagination. Set to true for default setup or pass an object with additional CPagination props.
   * Default pagination will always have the computed number of pages that cannot be changed.
   * The number of pages is generated based on the number of passed items and 'itemsPerPage' prop.
   * If this restriction is an obstacle, you can make external CPagination instead.
   */
  pagination?: boolean;
  /**
   * Properties to `CSmartPagination` component.
   * @link https://coreui.io/angular/docs/components/smart-pagination#csmartpagination
   * todo or remove?
   */
  // paginationProps?: CSmartPaginationProps
  /**
   * Scoped columns.
   // * @type ScopedColumns
   * todo or remove?
   */
  // scopedColumns?: ScopedColumns
  /**
   * Add checkboxes to make table rows selectable.
   * @type boolean
   */
  selectable?: boolean;
  /**
   * Enables select all checkbox displayed in the header of the table.
   * @type boolean
   */
  selectAll?: boolean;
  /**
   * State of the sorter. Name key is column name, direction can be 'asc' or 'desc'.
   * @type ISorterValue
   */
  sorterValue?: ISorterValue;
  /**
   * Sorter icon when items are unsorted.
   * @default '<svg cIcon width="18" content={cilArrowTop} />
   */
  sortingIcon?: TemplateRef<any>;
  /**
   * Sorter icon when items are sorted ascending.
   * @default '<svg cIcon width="18" content={cilArrowTop} />
   */
  sortingIconAscending?: TemplateRef<any>;
  /**
   * Sorter icon when items are sorted descending.
   * @default '<svg cIcon width="18" content={cilArrowBottom} />
   */
  sortingIconDescending?: TemplateRef<any>;
  /**
   * Properties to `TableBody` component.
   * @link https://coreui.io/angular/docs/components/table/#ctablebody
   */
  tableBodyProps?: ITableSectionProps;
  /**
   * Properties to `TableFoot` component.
   * @link https://coreui.io/angular/docs/components/table/#ctablefoot
   */
  tableFootProps?: ITableSectionProps;
  /**
   * When set, displays table filter above table, allowing filtering by specific column.
   *
   * Column filter can be customized, by passing prop as object with additional options as keys. Available options:
   * - placeholder (String) - Sets custom table filter placeholder.
   * - label (String) - Sets custom table filter label.
   * - external (Boolean) - Disables automatic filtering inside component.
   * - lazy (Boolean) - Set to true to trigger filter updates only on change event.
   */
  tableFilter?: boolean | ITableFilter;
  /**
   * The element represents a caption for a component.
   * @default 'Filter:'
   * todo or remove?
   */
  tableFilterLabel?: string;
  /**
   * Specifies a short hint that is visible in the search input.
   * @default 'type string...'
   * todo or remove?
   */
  tableFilterPlaceholder?: string;
  /**
   * Value of table filter. Set .sync modifier to track changes.
   * @type string
   */
  tableFilterValue?: string;
  /**
   * Properties to `CTableHead` component.
   * @link https://coreui.io/angular/docs/components/table/#ctablehead
   */
  tableHeadProps?: ITableSectionProps;
  /**
   * Properties to `CTable` component.
   * @link https://coreui.io/angular/docs/components/table/#ctable
   */
  tableProps?: ITable;
}

export interface ITableSectionProps extends ITableElementProps {
  align?: 'bottom' | 'middle' | 'top';
  color?: Colors;
  attributes?: Partial<HTMLTableSectionElement>;
}

export interface IColumnFilter {
  lazy?: boolean;
  external?: boolean;
}

export interface IColumnFilterValue {
  [key: string]: any;
}

export interface IColumn {
  children?: IColumn[];
  filter?: boolean | ((column: IItem, value: string) => boolean);
  group?: string;
  key: string;
  label?: string;
  sorter?: boolean | ((a: IItem, b: IItem) => number);
  _attr?: Partial<HTMLTableCellElement>;    // header
  _style?: Partial<CSSStyleDeclaration>;    // header
  _props?: ITableHeaderCellProps;           // header
  _classes?: NgCssClass;                    // header
  _colAttr?: Partial<HTMLTableColElement>;  // column
  _colStyle?: Partial<CSSStyleDeclaration>; // column
  _colProps?: ITableRowCellProps;           // column
  _colClass?: NgCssClass;                   // column
  _labelTemplateId?: string;
  _data?: any
}

export interface IGroup {
  children?: (IGroup | IColumn)[];
  colspan?: number;
  deep?: number;
  group?: string;
  key: string;
  label?: string;
  _attr?: Partial<HTMLTableCellElement>;
  _class?: NgCssClass;
  _props?: ITableHeaderCellProps;
  _style?: Partial<CSSStyleDeclaration>;
  _labelTemplateId?: string;
  _data?: any
}

export interface ITableHeaderCellProps {
  /**
   * Sets the color context of the component to one of CoreUI’s themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   */
  color?: Colors;

  [key: string]: any;
}

export interface ISorter {
  resetable?: boolean;
  resettable?: boolean;
  external?: boolean;
}

export interface IItem {
  _attr?: Partial<HTMLTableRowElement>;                                // ? row html attribs
  _class?: NgCssClass;                                                 // ? row css class
  _props?: ITableRowCellProps;                                         // row Props
  _style?: Partial<CSSStyleDeclaration>;                               // ? row css style
  _cellAttr?: ITableCellProps<HTMLTableCellElement>;                   // ? cell html attribs
  _cellClass?: ITableCellProps<NgCssClass>;                            // ? cell css class
  _cellProps?: ITableCellProps<ITableRowCellProps>;                    // cell props
  _cellStyle?: ITableCellProps<CSSStyleDeclaration>;                   // ? cell css style

  _selected?: boolean;
  _selectable?: boolean;

  [key: string]: number | string | any;
}

export interface ITableCellProps<T> {
  _all?: Partial<T>;

  [key: string]: Partial<T> | undefined;
}

export interface IItemInternal extends IItem {
  ___id?: number;
}

export interface ItemsPerPageSelect {
  external?: boolean;
  // label?: string;
  // values?: Array<number>;
}

// export interface ScopedColumns {
//   [key: string]: any
//   details?: (a: IItem, b: number) => ReactNode
// }

export interface ISorterValue {
  column?: string;
  state?: number | string;
}

export interface ITableFilter {
  lazy?: boolean;
  external?: boolean;
  label?: string;
  placeholder?: string;
  value?: string | number;
}

export type SortOrder = 'asc' | 'desc' | 0 | undefined;

