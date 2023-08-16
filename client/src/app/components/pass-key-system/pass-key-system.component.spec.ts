import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassKeySystemComponent } from './pass-key-system.component';

describe('PassKeySystemComponent', () => {
  let component: PassKeySystemComponent;
  let fixture: ComponentFixture<PassKeySystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassKeySystemComponent]
    });
    fixture = TestBed.createComponent(PassKeySystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
