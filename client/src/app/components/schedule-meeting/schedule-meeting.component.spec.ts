import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMeetingComponent } from './schedule-meeting.component';

describe('ScheduleMeetingComponent', () => {
  let component: ScheduleMeetingComponent;
  let fixture: ComponentFixture<ScheduleMeetingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleMeetingComponent]
    });
    fixture = TestBed.createComponent(ScheduleMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
