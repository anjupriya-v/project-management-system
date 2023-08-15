import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectForumPostComponent } from './create-project-forum-post.component';

describe('CreateProjectForumPostComponent', () => {
  let component: CreateProjectForumPostComponent;
  let fixture: ComponentFixture<CreateProjectForumPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProjectForumPostComponent]
    });
    fixture = TestBed.createComponent(CreateProjectForumPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
