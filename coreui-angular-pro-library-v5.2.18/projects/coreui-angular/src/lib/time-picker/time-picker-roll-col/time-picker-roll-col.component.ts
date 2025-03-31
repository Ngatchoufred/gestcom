import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';

import { ITimeValue } from '../time.utils';

export interface ITimePickerRollCol {
  elements: ITimeValue[];
  onClick?: (value: number | string) => void;
  selected?: number | string | null;
}

@Directive({
  selector: '[cTimeElement]',
  exportAs: 'cTimeElement',
  standalone: true
})
export class TimeElementDirective {
  constructor(public elementRef: ElementRef) {}

  @Input() cTimeElement!: ITimeValue;
}

@Component({
  selector: 'c-time-picker-roll-col',
  templateUrl: './time-picker-roll-col.component.html',
  styleUrls: ['./time-picker-roll-col.component.scss'],
  exportAs: 'cTimePickerRollCol',
  standalone: true,
  imports: [TimeElementDirective, NgClass]
})
export class TimePickerRollColComponent implements ITimePickerRollCol, OnChanges, AfterViewInit {
  constructor(public elementRef: ElementRef) {}

  #init = true;

  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() elements: ITimeValue[] = [];
  @Input() onClick?: (value: number | string) => void;
  @Input() selected?: number | string | null;
  @Input({ transform: booleanAttribute }) refresh?: boolean;

  @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class')
  get hostClasses() {
    return {
      'time-picker-roll-col': true,
      disabled: this.disabled
    };
  }

  @ViewChildren(TimeElementDirective) timeElements!: QueryList<TimeElementDirective>;

  ngAfterViewInit(): void {
    this.timeElements?.changes.subscribe((state) => {
      const selectedElement = this.timeElements?.find((element) => {
        return element.cTimeElement?.value === <number>this.selected;
      });
      this.scrollToElement(selectedElement?.elementRef.nativeElement);
    });
    setTimeout(() => {
      const selectedElement = this.elementRef.nativeElement.querySelector('.selected');
      this.scrollToElement(selectedElement);
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['refresh'] && changes['refresh'].currentValue) ||
      (changes['selected'] && !changes['selected'].firstChange)
    ) {
      const selectedElement = this.timeElements?.find((element) => {
        return element.cTimeElement?.value === <number>this.selected;
      });
      this.#init = !selectedElement;
      this.scrollToElement(selectedElement?.elementRef.nativeElement);
    }
  }

  scrollToElement(element: any) {
    setTimeout(() => {
      const elementSelected =
        element ??
        this.elementRef.nativeElement.querySelector('.selected') ??
        this.elementRef.nativeElement.firstElementChild;
      if (elementSelected) {
        this.elementRef.nativeElement.scrollTo({
          top: elementSelected?.offsetTop,
          behavior: this.#init ? 'auto' : 'smooth'
        });
        this.#init = false;
      }
    });
  }

  handleElementClick($event: MouseEvent, element: any) {
    if (element.disabled) {
      return;
    }
    this.selected = element.value;
    this.scrollToElement($event.target);
    this.onClick && this.onClick(element.value);
    this.selectedChange.emit(element.value);
  }

  handleElementKeyDown($event: KeyboardEvent, element: ITimeValue) {
    if ($event.code === 'Space' || $event.code === 'Enter') {
      $event.preventDefault();
      this.handleElementClick(<MouseEvent>(<unknown>$event), element);
    }
  }
}
