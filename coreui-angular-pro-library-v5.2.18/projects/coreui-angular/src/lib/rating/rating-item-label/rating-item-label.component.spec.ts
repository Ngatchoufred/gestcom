import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingItemLabelComponent } from './rating-item-label.component';

describe('RatingItemLabelComponent', () => {
  let component: RatingItemLabelComponent;
  let fixture: ComponentFixture<RatingItemLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingItemLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingItemLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
