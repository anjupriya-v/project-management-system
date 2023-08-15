import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightedDatesComponent } from './highlighted-dates.component';

describe('HighlightedDatesComponent', () => {
  let component: HighlightedDatesComponent;
  let fixture: ComponentFixture<HighlightedDatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightedDatesComponent]
    });
    fixture = TestBed.createComponent(HighlightedDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
