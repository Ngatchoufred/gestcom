import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'c-multi-select-native-select',
  templateUrl: './multi-select-native-select.component.html',
  styleUrls: ['./multi-select-native-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class MultiSelectNativeSelectComponent {

  @Input() form?: string = '';
  @Input() id?: string = '';
  @Input({ transform: booleanAttribute }) multiple?: boolean;
  @Input() name?: string;
  @Input() options?: any[];
  @Input({ transform: booleanAttribute }) disabled?: boolean;

  constructor(
    public changeDetectorRef: ChangeDetectorRef
  ) { }
}
