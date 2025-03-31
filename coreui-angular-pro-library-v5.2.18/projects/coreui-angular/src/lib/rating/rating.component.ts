import { FocusKeyManager } from '@angular/cdk/a11y';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  inject,
  input,
  InputSignalWithTransform,
  model,
  numberAttribute,
  output,
  signal,
  untracked,
  viewChildren
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge, takeWhile } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { TooltipDirective } from '../tooltip';
import { ElementRefDirective, TemplateIdDirective } from '../shared';
import { RatingItemLabelComponent } from './rating-item-label/rating-item-label.component';

export const coerceStringArray = (value: string | string[]): string[] => (Array.isArray(value) ? [...value] : [value]);
export const coerceRatingPrecision = (value: number | string): number =>
  [1, 0.5, 0.25].includes(numberAttribute(value)) ? numberAttribute(value) : 1;
export const coerceNumber = (value: number | string | null): number => Number(value ?? 0);

@Component({
  selector: 'c-rating',
  exportAs: 'cRating',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    forwardRef(() => TooltipDirective),
    ElementRefDirective,
    RatingItemLabelComponent
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingComponent implements ControlValueAccessor {
  readonly #destroyRef = inject(DestroyRef);
  readonly #elementRef = inject(ElementRef);

  /**
   * The default icon to display when the item is selected.
   * @type: string | string[]
   */
  readonly activeIcon: InputSignalWithTransform<string[], string | string[]> = input([], {
    transform: coerceStringArray
  });

  /**
   * Enables the clearing upon clicking the selected item again.
   * @type: boolean
   * @default: false
   */
  readonly allowClear = input(false, { transform: booleanAttribute });

  /**
   * Toggle the disabled state for the component.
   * @type: boolean
   * @default: false
   */
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly #disabledState = signal(this.disabled());

  /**
   * If enabled, only the currently selected icon will be visibly highlighted.
   * @type: boolean
   * @default: false
   */
  readonly highlightOnlySelected = input(false, { transform: booleanAttribute });

  /**
   * The default icon to display when the item is not selected.
   * @type: string | string[]
   */
  readonly icon: InputSignalWithTransform<string[], string | string[]> = input([], {
    transform: coerceStringArray
  });

  /**
   * Specifies the total number of stars to be displayed in the star rating component. This property determines the scale of the rating,
   * such as out of 5 stars, 10 stars, etc.
   * @type: number
   * @default: 5
   */
  readonly itemCount = input(5, { transform: numberAttribute });

  /**
   * Minimum increment value change allowed.
   * @type: number
   * @default: 1
   */
  readonly precision = input(1, { transform: numberAttribute });

  /**
   * Allows to click fractions
   * @type: boolean
   * @default: false
   */
  // readonly precisionClick = input(false, { transform: booleanAttribute });

  /**
   * Toggle the readonly state for the component.
   * @type: boolean
   * @default: false
   */
  readonly readOnly = input(false, { transform: booleanAttribute });

  /**
   * Size the component small, large, or custom if you define custom icons with custom height.
   * @type: 'sm' | 'lg' | 'custom' | undefined
   * @default: undefined
   */
  readonly size = input<'sm' | 'lg' | 'custom' | undefined>(undefined);

  /**
   * Enable tooltips with default values or set specific labels for each icon.
   * @type: boolean | string[] | undefined
   * @default: undefined
   */
  readonly tooltips = input<boolean | string[] | undefined>(undefined);

  /**
   * The `value` attribute of component.
   * @type: number | null
   * @default: null
   * Emits `valueChange` on value change
   */
  readonly value = model<number | null>(null);

  /**
   * Event emitted on hoverValue change.
   * @type: number | null
   */
  readonly hoverValue = signal<number | null>(null);
  readonly hoverValueChange = output<number | null>();
  readonly hoverValueEffect = effect(
    () => {
      this.hoverValueChange.emit(this.hoverValue());
      if (!this.hoverValue()) {
        this.hoveredItem.set(undefined);
      }
    },
    { allowSignalWrites: true }
  );

  readonly #cleared = signal(false);
  readonly hoveredItem = signal<number | undefined>(undefined);
  readonly tooltipValue = signal<string | number | null>(null);

  readonly ratingDisabled = computed<boolean>(() => this.disabled() || this.readOnly() || this.#disabledState());
  readonly ratingDisabledEffect = effect(() => {
    if (!this.ratingDisabled()) {
      const focusIn$ = fromEvent<FocusEvent>(this.#elementRef.nativeElement, 'focusin');
      const focusOut$ = fromEvent<FocusEvent>(this.#elementRef.nativeElement, 'focusout');
      const mouseLeave$ = fromEvent<MouseEvent>(this.#elementRef.nativeElement, 'mouseleave');

      merge(focusIn$, focusOut$, mouseLeave$)
        .pipe(
          filter((event) => !this.ratingDisabled()),
          tap(($event) => {
            switch ($event.type) {
              case 'focusin':
                this.onTouched();
                break;
              case 'focusout':
              case 'mouseleave':
                this.hoverValue.set(null);
                break;
            }
          }),
          takeWhile(() => !this.ratingDisabled()),
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe();
    }
  });

  readonly contentTemplates = contentChildren(TemplateIdDirective);

  readonly iconTemplates = computed(() => {
    const templateArray = this.contentTemplates().map((child: TemplateIdDirective) => {
      return [[child.id], child.templateRef];
    });
    return Object.fromEntries(templateArray);
  });

  readonly numberOfSubItems = computed(() => {
    return parseInt((1 / this.precision()).toFixed());
  });

  readonly ratingItems = computed(() => {
    return Array.from({ length: this.itemCount() }, (_, itemIndex) => {
      if (this.numberOfSubItems() === 1) {
        return [itemIndex + 1];
      }
      return Array.from(
        { length: this.numberOfSubItems() },
        (_, subIndex) => itemIndex + (subIndex + 1) * this.precision()
      );
    });
  });

  readonly ratingItemLabels = viewChildren(RatingItemLabelComponent);
  #focusKeyManager!: FocusKeyManager<RatingItemLabelComponent>;

  readonly ratingItemLabelsEffect = effect(
    () => {
      if (untracked(this.ratingDisabled)) {
        return;
      }
      this.#focusKeyManager = new FocusKeyManager(this.ratingItemLabels()).withHorizontalOrientation('ltr').withWrap();

      const activeItemIndex = this.ratingItems()
        .flat()
        .findIndex((value) => value === coerceNumber(this.value() ?? 0));

      this.#focusKeyManager?.updateActiveItem(activeItemIndex < 0 ? 0 : activeItemIndex);

      this.#focusKeyManager.tabOut
        .pipe(
          tap((x) => {
            const activeItemIndex = untracked(this.ratingItems)
              .flat()
              .findIndex((value) => value === coerceNumber(untracked(this.value) ?? 0));

            this.#focusKeyManager.updateActiveItem(activeItemIndex === -1 ? 0 : activeItemIndex);
            this.updateFocusableItems();
          }),
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe();

      this.#focusKeyManager.change
        .pipe(
          tap((value) => {
            this.ratingItemLabels().forEach((label, index) => {
              label.focusable.set(index === this.#focusKeyManager.activeItemIndex);
              if (index === this.#focusKeyManager.activeItemIndex) {
                const value = untracked(label.value);
                this.handleClick(value);
              }
            });
          }),
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe();
    },
    { allowSignalWrites: true }
  );

  @HostBinding('class')
  get hostClasses() {
    return {
      rating: true,
      [`rating-${this.size()}`]: this.size(),
      disabled: this.disabled() || this.#disabledState(),
      readonly: this.readOnly()
    };
  }

  @HostBinding('attr.aria-valuenow')
  get ariaValueNow() {
    return this.value();
  }

  @HostBinding('attr.aria-valuemax')
  get ariaValueMax() {
    return this.itemCount();
  }

  @HostBinding('attr.role')
  get role() {
    return 'radiogroup';
  }

  @HostListener('keydown', ['$event'])
  onKeydown($event: any) {
    if (this.ratingDisabled()) {
      return false;
    }
    if (['Space', 'Enter'].includes($event.code)) {
      $event.preventDefault();
      const item = this.ratingItemLabels().find((label, index) => index === this.#focusKeyManager?.activeItemIndex);
      this.handleClick(item?.value() ?? -1);
      return;
    }
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes($event.key)) {
      this.#focusKeyManager.onKeydown($event);
      return;
    }
    if (['Tab'].includes($event.key)) {
      this.#focusKeyManager?.tabOut.next();
    }
    return;
  }

  onChange = (value: number | null) => {
    /* empty */
  };
  onTouched = () => {
    /* empty */
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.#disabledState.set(isDisabled);
  }

  writeValue(value: number | null): void {
    this.value.set(value);
  }

  isItemActive(value: number) {
    const localValue = this.hoverValue() ?? this.value() ?? -1;
    return this.highlightOnlySelected() ? localValue === value : localValue >= value;
  }

  notLastItemStyle(value: number) {
    return {
      zIndex: this.numberOfSubItems() - value,
      position: 'absolute',
      width: `${this.precision() * (value + 1) * 100}%`,
      overflow: 'hidden',
      opacity: 0.1
    };
  }

  handleFocusIn($event: FocusEvent, itemValue: number) {
    this.handleMouseEnter($event as MouseEvent, itemValue);
  }

  handleClick(value: number) {
    if (this.ratingDisabled()) {
      return;
    }
    if (this.allowClear() && value === this.value()) {
      this.#cleared.set(true);
      this.value.set(null);
      this.hoverValue.set(null);
    } else {
      this.value.set(value);
    }
  }

  handleMouseEnter($event: MouseEvent, value: number): void {
    if (this.ratingDisabled()) {
      return;
    }
    this.hoverValue.set(null);
    this.hoverValue.set(value);
    this.tooltipValue.set(value);
  }

  getTooltipValue(index: number): string | undefined {
    if (!this.hoverValue() || this.hoveredItem() !== index) {
      return undefined;
    }
    if (Array.isArray(this.tooltips())) {
      const tooltips = this.tooltips() as string[];
      return tooltips[index];
    }
    return this.precision()
      ? (this.tooltipValue()?.toString() ?? '')
      : this.ratingItems()
        ? (this.ratingItems()[index].at(-1) ?? '').toString()
        : '';
  }

  updateFocusableItems() {
    this.ratingItemLabels().forEach((label, index) => {
      label.focusable.set(index === this.#focusKeyManager?.activeItemIndex);
    });
  }

  // keep it at the bottom of the code
  readonly valueEffect = effect(
    () => {
      const ratingValue = this.value();
      this.onChange(ratingValue);

      if (untracked(this.ratingDisabled)) {
        return;
      }

      if (untracked(this.#cleared)) {
        this.#cleared.set(false);
        return;
      }
      const activeItemIndex = this.ratingItems()
        .flat()
        .findIndex((value) => value === coerceNumber(ratingValue ?? 0));

      this.#focusKeyManager?.updateActiveItem(activeItemIndex < 0 ? 0 : activeItemIndex);
      this.updateFocusableItems();
    },
    { allowSignalWrites: true }
  );
}
