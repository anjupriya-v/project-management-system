import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectForumsComponent } from './project-forums.component';

describe('ProjectForumsComponent', () => {
  let component: ProjectForumsComponent;
  let fixture: ComponentFixture<ProjectForumsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectForumsComponent]
    });
    fixture = TestBed.createComponent(ProjectForumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
