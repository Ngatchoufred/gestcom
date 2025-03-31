import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'c-multi-select-optgroup-label',
  template: '<ng-content />',
  styleUrls: ['./multi-select-optgroup-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: { class: 'form-multi-select-optgroup-label' }
})
export class MultiSelectOptgroupLabelComponent {}
