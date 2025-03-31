import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectOptgroupLabelComponent } from './multi-select-optgroup-label.component';

describe('MultiSelectOptgroupLabelComponent', () => {
  let component: MultiSelectOptgroupLabelComponent;
  let fixture: ComponentFixture<MultiSelectOptgroupLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectOptgroupLabelComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectOptgroupLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have css classes', () => {
    expect(fixture.nativeElement).toHaveClass('form-multi-select-optgroup-label');
  });
});
