import {
  booleanAttribute,
  Component,
  computed,
  effect,
  input,
  InputSignal,
  InputSignalWithTransform,
  output,
  OutputEmitterRef
} from '@angular/core';

import { ButtonDirective } from '../button';
import { SpinnerComponent } from '../spinner';
import { loadingButtonAnimation } from './loading-button.animations';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[cLoadingButton], a[cLoadingButton]',
  templateUrl: './loading-button.component.html',
  exportAs: 'cLoadingButton',
  imports: [SpinnerComponent],
  standalone: true,
  animations: [loadingButtonAnimation],
  host: {
    class: 'btn-loading',
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'ariaDisabled()',
    '[attr.aria-pressed]': 'isActive()',
    '[attr.disabled]': 'attrDisabled()',
    '[attr.tabindex]': 'tabIndex()',
    '[attr.type]': 'type()'
  }
})
export class LoadingButtonComponent extends ButtonDirective {
  /**
   * Makes button disabled when loading.
   * @type boolean
   * @default false
   */
  disabledOnLoading: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /**
   * Loading state (set to true to start animation).
   * @type boolean
   */
  loading: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /**
   * Event emitted on loading change
   * @type boolean
   */
  loadingChange: OutputEmitterRef<boolean> = output<boolean>();

  loadingEffect = effect(() => {
    this.loadingChange.emit(this.loading());
  });

  /**
   * Sets type of spinner.
   * @type {'border' | 'grow'}
   */
  spinnerType: InputSignal<'border' | 'grow'> = input<'border' | 'grow'>('border');

  constructor() {
    super();
  }

  override hostClasses = computed(() => {
    return {
      btn: true,
      'btn-loading': true,
      'is-loading': this.loading(),
      [`btn-${this.color()}`]: !!this.color() && !this.variant(),
      [`btn-${this.variant()}`]: !!this.variant() && !this.color(),
      [`btn-${this.variant()}-${this.color()}`]: !!this.variant() && !!this.color(),
      [`btn-${this.size()}`]: !!this.size(),
      active: this.active(),
      disabled: this._disabled()
    } as Record<string, boolean>;
  });

  override _disabled = computed(() => {
    return this.disabled() || (this.disabledOnLoading() && this.loading());
  });
}
