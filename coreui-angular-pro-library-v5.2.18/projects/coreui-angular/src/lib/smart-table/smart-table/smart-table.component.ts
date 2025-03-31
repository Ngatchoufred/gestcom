import {
  AfterContentInit,
  booleanAttribute,
  Component,
  computed,
  ContentChildren,
  EventEmitter,
  Input,
  IterableDiffer,
  IterableDiffers,
  KeyValueDiffer,
  KeyValueDiffers,
  numberAttribute,
  OnChanges,
  Output,
  QueryList,
  signal,
  SimpleChanges,
  TemplateRef,
  Type,
  WritableSignal
} from '@angular/core';
import { AsyncPipe, JsonPipe, NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { ITable } from '../../table/table.type';
import {
  IColumn,
  IColumnFilter,
  IColumnFilterValue,
  IGroup,
  IItem,
  IItemInternal,
  ISmartTable,
  ISorter,
  ISorterValue,
  ITableFilter,
  ITableSectionProps,
  ItemsPerPageSelect,
  SortOrder
} from '../smart-table.type';

import {
  getClickedColumnName,
  getColumnGroups,
  getColumnKey,
  getColumnNames,
  getColumnNamesFromItems,
  getColumns,
  getTableDataCellClass,
  getTableDataCellProps,
  getTableDataCellStyles
} from '../smart-table.utils';

import { ButtonDirective } from '../../button';
import { FormCheckInputDirective } from '../../form';
import { ElementCoverComponent } from '../../element-cover';
import { HtmlAttributesDirective, TemplateIdDirective } from '../../shared';
import { SmartPaginationComponent } from '../../smart-pagination';
import { TableActiveDirective, TableColorDirective, TableDirective } from '../../table';
import { AlignDirective } from '../../utilities';
import { SmartTableFilterComponent } from '../smart-table-filter/smart-table-filter.component';
import { FilterInputDirective } from '../smart-table-filter/filter-input.directive';
import { SmartTableHeadComponent } from '../smart-table-head/smart-table-head.component';
import { SmartTableItemsPerPageSelectorComponent } from '../smart-table-items-per-page-selector/smart-table-items-per-page-selector.component';

@Component({
  selector: 'c-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
  exportAs: 'cSmartTable',
  standalone: true,
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    NgClass,
    NgStyle,
    AlignDirective,
    ButtonDirective,
    ElementCoverComponent,
    FilterInputDirective,
    FormCheckInputDirective,
    HtmlAttributesDirective,
    SmartPaginationComponent,
    SmartTableFilterComponent,
    SmartTableHeadComponent,
    SmartTableItemsPerPageSelectorComponent,
    TableActiveDirective,
    TableColorDirective,
    TableDirective,
    JsonPipe
  ]
})
export class SmartTableComponent implements ISmartTable, AfterContentInit, OnChanges {
  constructor(
    private iterableDiffers: IterableDiffers,
    private keyValueDiffers: KeyValueDiffers
  ) {
    this.itemsDiffer = this.iterableDiffers.find(this.items).create();
    this.itemsFilteredDiffer = this.iterableDiffers.find(this._columnFiltered).create();
    this.columFilterValueDiffer = this.keyValueDiffers.find(this.columnFilterValue).create();
    this.sorterValueDiffer = this.keyValueDiffers.find(this.sorterValue).create();

    setTimeout(() => {
      this.selectedAllSubject.next(this.selectedAll);
    }, 0);
  }

  readonly getColumnKey = getColumnKey;
  readonly getTableDataCellClass = getTableDataCellClass;
  readonly getTableDataCellProps = getTableDataCellProps;
  readonly getTableDataCellStyles = getTableDataCellStyles;

  readonly selectedAllSubject = new BehaviorSubject<boolean | 'indeterminate'>(false);

  private readonly itemsDiffer: IterableDiffer<any> | null;
  private readonly itemsFilteredDiffer: IterableDiffer<any> | null;
  private readonly columFilterValueDiffer: KeyValueDiffer<any, any> | null;
  private readonly sorterValueDiffer: KeyValueDiffer<any, any> | null;

  @Input({ transform: numberAttribute })
  set activePage(value: number) {
    this._activePage = value || 1;
    this.activePageChange.emit(this._activePage);
  }

  get activePage(): number {
    return this._activePage;
  }

  private _activePage = 1;

  @Input({ transform: booleanAttribute }) cleaner = false;

  @Input({ transform: booleanAttribute }) clickableRows = false;

  @Input()
  set columns(value: (string | IColumn | IGroup)[]) {
    const colObjects = value.map((column) => (typeof column === 'string' ? { key: column } : { ...column }));
    const columns: IColumn[] = getColumns(colObjects);
    this.columns$.set(columns);

    // todo: Input columnGroups - separation?
    // console.log(getColumnGroups(colObjects ?? []));
    const groups = getColumnGroups(value ?? []);
    this.columnGroups$.set(groups);
  }

  get columns(): IColumn[] {
    return this.columns$();
  }

  columns$: WritableSignal<IColumn[]> = signal([]);
  columnGroups$: WritableSignal<IGroup[][]> = signal([]);
  showGroups$ = computed(() => !!this.columnGroups$().length);

  @Input() columnFilter?: boolean | IColumnFilter;

  @Input()
  set columnFilterValue(value: IColumnFilterValue) {
    if (this.columFilterValueDiffer) {
      const changes = this.columFilterValueDiffer.diff(value);
      if (changes) {
        this._columnFilterValue = { ...value };
        this.columnFilterValueChange.emit({ ...this._columnFilterValue });
        this.tableFiltered; // emits tableFiltered change
      }
    }
  }

  get columnFilterValue(): IColumnFilterValue {
    return this._columnFilterValue;
  }

  private _columnFilterValue: IColumnFilterValue = {};

  @Input() columnSorter?: boolean | ISorter;

  @Input({ transform: booleanAttribute }) footer = false;

  @Input({ transform: booleanAttribute }) header = false;

  @Input()
  set items(value: IItem[]) {
    if (this.itemsDiffer) {
      const changes = this.itemsDiffer.diff(value);
      if (changes) {
        this._items = this.setItems(value) as Type<IItemInternal>[];
        this.items$.set(this._items);
        if (!this.columns.length) {
          this.columns = getColumnNamesFromItems(this.items$());
        }
      }
    }
  }

  get items() {
    return this._items;
  }

  items$ = signal([] as IItemInternal[]);
  private _items: IItemInternal[] = [] as Type<IItemInternal>[];

  @Input({ transform: numberAttribute })
  set itemsPerPage(value: number) {
    this._itemsPerPage = value;
  }

  get itemsPerPage(): number {
    return this._itemsPerPage;
  }

  private _itemsPerPage: number = 10;

  @Input() itemsPerPageLabel: string = 'Items per page:';
  @Input() itemsPerPageOptions: number[] = [5, 10, 20, 50];
  @Input() itemsPerPageSelect?: boolean | ItemsPerPageSelect;
  @Input() loading?: boolean;
  @Input() noItemsLabel: string | TemplateRef<any> = 'No items found';

  @Input({ transform: booleanAttribute }) pagination = false;

  @Input({ transform: booleanAttribute })
  set selectable(value: boolean) {
    this._selectable = value;
  }

  get selectable(): boolean {
    return this._selectable;
  }

  private _selectable: boolean = false;

  @Input({ transform: booleanAttribute }) selectAll = true;

  @Input()
  set sorterValue(value: ISorterValue) {
    if (this.sorterValueDiffer) {
      const changes = this.sorterValueDiffer.diff(value);
      if (changes) {
        this._sorterValue = value;
        this.sorterValueChange.emit({ ...value });
      }
    }
  }

  get sorterValue(): ISorterValue {
    return this._sorterValue;
  }

  private _sorterValue: ISorterValue = {};

  @Input()
  set tableFilter(filter) {
    this._tableFilter = filter;
    if (typeof filter === 'object') {
      this.tableFilterLabel = typeof filter.label === 'string' ? filter.label : this.tableFilterLabel;
      this.tableFilterPlaceholder =
        typeof filter.placeholder === 'string' ? filter.placeholder : this.tableFilterPlaceholder;
      this.tableFilterValue = typeof filter.value === 'string' ? filter.value : this.tableFilterValue;
    }
  }

  get tableFilter() {
    return this._tableFilter;
  }

  private _tableFilter?: boolean | ITableFilter;

  @Input() tableFilterLabel = 'Filter:';
  @Input() tableFilterPlaceholder = 'type string...';

  @Input()
  set tableFilterValue(value: string) {
    if (this._tableFilterValue !== value) {
      this._tableFilterValue = value;
      this.tableFilterValueChange.emit(value);
      this.tableFiltered; // emits tableFiltered change
    }
  }

  get tableFilterValue(): string {
    return this._tableFilterValue;
  }

  private _tableFilterValue: string = '';

  @Input() tableBodyProps?: ITableSectionProps = {};
  @Input() tableFootProps?: ITableSectionProps = {};
  @Input() tableHeadProps?: ITableSectionProps = {};
  @Input() tableProps?: ITable = {};

  @Output() readonly selectedItemsChange: EventEmitter<IItem[]> = new EventEmitter<IItem[]>();
  @Output() readonly sorterValueChange: EventEmitter<ISorterValue> = new EventEmitter<ISorterValue>();
  @Output() readonly activePageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() readonly itemsPerPageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() readonly rowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() readonly columnFilterValueChange: EventEmitter<IColumnFilterValue> = new EventEmitter<IColumnFilterValue>();
  @Output() readonly filteredItemsChange: EventEmitter<IItemInternal[]> = new EventEmitter<IItemInternal[]>();
  @Output() readonly tableFilterValueChange: EventEmitter<string> = new EventEmitter<string>();

  @ContentChildren(TemplateIdDirective) columnTemplates!: QueryList<TemplateIdDirective>;
  templates: { [key: string]: TemplateRef<any> | null } = { tableDetails: null, tableData: null };
  columnFilterTemplates: { [key: string]: TemplateRef<any> | null } = {};
  columnLabelTemplates: { [key: string]: TemplateRef<any> | null } = {};
  summaryRowTemplate: TemplateRef<unknown> | null = null;

  ngAfterContentInit(): void {
    this.columnTemplates.forEach((child: TemplateIdDirective) => {
      if (child.id.startsWith('columnFilter_')) {
        this.columnFilterTemplates[child.id] = child.templateRef;
        return;
      }
      if (child.id.startsWith('columnLabel_')) {
        this.columnLabelTemplates[child.id] = child.templateRef;
        return;
      }
      if (child.id === 'tableSummaryRow') {
        this.summaryRowTemplate = child.templateRef;
        return;
      }
      this.templates[child.id] = child.templateRef;
    });
    this.columnFilterTemplates = { ...this.columnFilterTemplates };
    this.columnLabelTemplates = { ...this.columnLabelTemplates };
  }

  get selectedAll() {
    const selected = this.items.some((item) => item._selected === true);
    const unselected = this.items.some((item) => item._selected === false);
    return selected && unselected ? 'indeterminate' : selected;
  }

  get tableFilterState() {
    return this.tableFilterValue ? this.tableFilterValue : '';
  }

  get columnFilterState() {
    return this.columnFilterValue ? this.columnFilterValue : {};
  }

  get numberOfPages(): number {
    return this._itemsPerPage ? Math.ceil(this.sortedItems.length / this._itemsPerPage) : 1;
  }

  get colspan(): number {
    return this._selectable ? this.rawColumnNames$().length + 1 : this.rawColumnNames$().length;
  }

  get firstItemOnActivePageIndex(): number {
    return this._activePage ? (this._activePage - 1) * this._itemsPerPage : 0;
  }

  get itemsOnActivePage(): IItemInternal[] {
    return this.sortedItems.slice(
      this.firstItemOnActivePageIndex,
      this.firstItemOnActivePageIndex + this._itemsPerPage
    );
  }

  get currentItems(): IItemInternal[] {
    return this._activePage ? this.itemsOnActivePage : (this.sortedItems ?? []);
  }

  rawColumnNames$ = computed(() => {
    return getColumnNames(this.columns$(), this.items$());
  });

  itemsDataColumns$ = computed(() =>
    this.rawColumnNames$().filter((name) => getColumnNamesFromItems(this.items$()).includes(name))
  );

  get sortedItems(): IItemInternal[] {
    const columnKey = this.sorterValue.column;
    if (
      !columnKey ||
      !this.itemsDataColumns$().includes(columnKey) ||
      (this.columnSorter && typeof this.columnSorter === 'object' && this.columnSorter.external)
    ) {
      return this.tableFiltered;
    }
    const tableFiltered = [...this.tableFiltered];

    // if values in column are to be sorted by numeric value they all have to be a type of number
    const flip = this.sorterValue.state === 'asc' ? 1 : this.sorterValue.state === 'desc' ? -1 : 0;

    if (flip === 0) {
      return tableFiltered;
    }

    const currentColumn = this.columns.find((column) => column.key === columnKey);
    if (typeof currentColumn?.sorter === 'function') {
      const sorted = tableFiltered.slice().sort(currentColumn.sorter);
      return flip < 0 ? sorted.reverse() : sorted;
    }

    const compareFn = (item1: { [x: string]: any }, item2: { [x: string]: any }) => {
      const value1 = item1[columnKey];
      const value2 = item2[columnKey];
      const a = typeof value1 === 'number' ? value1 : String(value1).toLowerCase();
      const b = typeof value2 === 'number' ? value2 : String(value2).toLowerCase();
      return a > b ? 1 * flip : b > a ? -1 * flip : 0;
    };

    return tableFiltered.slice().sort(compareFn);
  }

  get tableFilterEvent(): 'change' | 'input' {
    return typeof this.tableFilter === 'object' && this.tableFilter.lazy ? 'change' : 'input';
  }

  private _columnFiltered: IItemInternal[] = [];

  get columnFiltered(): IItemInternal[] {
    let _items = this._items;
    if (this.columnFilter && typeof this.columnFilter === 'object' && this.columnFilter.external) {
      this._columnFiltered = _items;
      return _items;
    }
    Object.entries(this.columnFilterState).forEach(([key, value]) => {
      if (value instanceof Function) {
        _items = _items.filter((item) => value(item[key]));
        return;
      }

      const currentColumn = this.columns.find((column) => column.key === key);
      if (typeof currentColumn?.filter === 'function') {
        _items = _items.filter(
          (item) => (typeof currentColumn.filter === 'function' && currentColumn.filter(item, value)) ?? !value
        );
        return;
      }

      const columnFilter = String(value).toLowerCase();
      if (columnFilter && this.itemsDataColumns$().includes(key)) {
        _items = _items.filter((item) => String(item[key]).toLowerCase().includes(columnFilter));
      }
    });
    this._columnFiltered = _items;
    return _items;
  }

  get tableFiltered(): IItemInternal[] {
    let items = this.columnFiltered;
    if (
      !this.tableFilterState ||
      (this.tableFilter && typeof this.tableFilter === 'object' && this.tableFilter.external)
    ) {
      if (this.itemsFilteredDiffer) {
        const changes = this.itemsFilteredDiffer.diff(items);
        if (changes) {
          this.filteredItemsChange.emit(items);
        }
      }
      return items;
    }
    const filter = this.tableFilterState.toLowerCase();
    const valueContainFilter = (val: any) => String(val).toLowerCase().includes(filter);
    // @ts-ignore
    items = items.filter((item: { [x: string]: any }) => {
      return !!this.itemsDataColumns$().find((key) => valueContainFilter(item[key]));
    });
    if (this.itemsFilteredDiffer) {
      const changes = this.itemsFilteredDiffer.diff(items);
      if (changes) {
        this.filteredItemsChange.emit(items);
      }
    }
    return items;
  }

  get isFiltered() {
    return this.tableFilterState || this.sorterValue?.column || Object.values(this.columnFilterState).join('');
  }

  private setItems(items: IItem[]) {
    if (Array.isArray(items)) {
      return items.map((item: IItem, index: number) => {
        return { ...item, ___id: item['___id'] ?? index };
      });
    }
    return <IItemInternal>[];
  }

  handleSortChange($event: { columnKey: string; index: number; order?: SortOrder }) {
    this.handleSorterChange($event.columnKey, $event.index, $event.order);
  }

  isSortable(i: number): boolean | undefined {
    const isDataColumn = this.itemsDataColumns$().includes(this.rawColumnNames$()[i]);
    let column;
    if (this.columns.length) {
      column = this.columns[i];
    }
    return (
      this.columnSorter &&
      (!this.columns.length ||
        typeof column !== 'object' ||
        (typeof column === 'object' && (typeof column.sorter === 'undefined' || column.sorter))) &&
      isDataColumn
    );
  }

  handleSorterChange(column: string, index: number, order?: SortOrder): void {
    if (!this.isSortable(index)) {
      return;
    }
    //if column changed or sort was descending change asc to true
    const sorterState = { ...this.sorterValue };

    if (sorterState.column === column) {
      const resettable =
        this.columnSorter === true ||
        (typeof this.columnSorter === 'object' &&
          this.columnSorter.resetable !== false &&
          this.columnSorter.resettable !== false);
      const state = sorterState.state;
      if (order === undefined) {
        sorterState.state = state === 0 ? 'asc' : state === 'asc' ? 'desc' : resettable ? 0 : 'asc';
      } else {
        sorterState.state = order === 0 && !resettable ? state : order;
      }
    } else {
      sorterState.column = column;
      sorterState.state = 'asc';
    }
    this.sorterValue = { ...sorterState };
  }

  setActivePage($event: number) {
    this.activePage = $event;
  }

  handleColumnFilterChange($event: any) {
    const { column, value, type } = $event;
    this.setActivePage(1);
    this.columnFilterValue = { ...this.columnFilterValue, [`${column}`]: value };
  }

  handleTableFilterChange($event: { value: string; type: string }) {
    const { value, type } = $event;
    const isLazy = typeof this.tableFilter === 'object' && this.tableFilter.lazy === true;
    if (((isLazy && type === 'input') || (!isLazy && type === 'change')) && value.length !== 0) {
      return;
    }
    this.setActivePage(1);
    this.tableFilterValue = value;
  }

  clean($event: MouseEvent) {
    this.columnFilterValue = {};
    this.tableFilterValue = '';
    this.sorterValue = {};
    this.tableFiltered; //emits tableFiltered change
  }

  handleItemsPerPageChange(value: number) {
    if (value !== this._itemsPerPage) {
      this.setActivePage(1);
      this._itemsPerPage = value;
      this.itemsPerPageChange.emit(value);
    }
  }

  handleRowChecked($event: Event, item: IItemInternal) {
    item._selected = item._selectable !== false && ($event.target as HTMLInputElement).checked;
    this.selectedItemsChange.emit(this.items.filter((item) => item._selected === true));
    setTimeout(() => {
      this.selectedAllSubject.next(this.selectedAll);
    }, 0);
  }

  handleSelectAllChange($event: any) {
    this._items = this.items.map((item: IItemInternal) => {
      return { ...item, _selected: item._selectable !== false ? $event : !!item._selected };
    });
    this.selectedAllSubject.next($event);
    setTimeout(() => {
      this.selectedItemsChange.emit(this.items.filter((item) => item._selected === true));
      this.selectedAllSubject.next(this.selectedAll);
    }, 0);
  }

  handleRowClick(param: { $event: MouseEvent; item: IItemInternal; i: number }) {
    const { $event, item, i } = { ...param };
    const target = $event.target as HTMLTextAreaElement;
    const columnNames = this.rawColumnNames$();
    const selectable = this._selectable;
    const columnName = getClickedColumnName(target, columnNames, selectable);
    this.rowClick.emit({ item: item, index: i + this.firstItemOnActivePageIndex, columnName, event: $event });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columnFilterValue']) {
      const columnFilterValueChange = changes['columnFilterValue'];
      const currentValue = columnFilterValueChange.currentValue;
      if (typeof currentValue === 'object' && Object.keys(currentValue ?? {}).length) {
        this.setActivePage(1);
      }
    }
    if (changes['tableFilterValue']) {
      const tableFilterValueChange = changes['tableFilterValue'];
      const currentValue = tableFilterValueChange.currentValue;
      if (currentValue.length) {
        this.setActivePage(1);
      }
    }
  }
}
