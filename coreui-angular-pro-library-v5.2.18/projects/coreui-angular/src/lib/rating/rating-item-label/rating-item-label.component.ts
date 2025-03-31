import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, Renderer2, signal } from '@angular/core';
import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';

@Component({
  selector: 'c-rating-item-label',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingItemLabelComponent implements FocusableOption {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);
  readonly label = input('');
  readonly value = input.required<number>();
  readonly focusable = signal(false);

  focusableEffect = effect(() => {
    this.#renderer.setAttribute(this.#elementRef.nativeElement, 'tabindex', this.focusable() ? '0' : '-1');
  });

  // @HostBinding('attr.tabindex')
  // get tabIndex() {
  //   // console.log('active', this.active(), this.active() ? '0' : '-1')
  //   console.log('focusable', this.value(), this.focusable(), this.focusable() ? '0' : '-1');
  //   return this.focusable() ? '0' : '-1';
  // }

  focus(origin?: FocusOrigin): void {
    this.#elementRef.nativeElement.focus();
  }

  getLabel(): string {
    return this.label() || this.value().toString();
  }
}
