import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-project-forums',
  templateUrl: './project-forums.component.html',
  styleUrls: ['./project-forums.component.css'],
})
export class ProjectForumsComponent implements OnInit {
  visible = false;
  requiredForm!: FormGroup;
  submitted: boolean = false;
  forumDetails: any[] = [];
  copyForumDetails: any[] = [];
  commentDetails: any[] = [];
  copyCommentDetails: any[] = [];
  currentForumId: any;
  addCommentBtnLoading: boolean = false;
  noSearchDataFound: any = false;
  selectedForumSort: any = 'default';
  selectedCommentSort: any = 'default';
  projectForumsLoader: boolean = false;
  @ViewChild('addCommentContainer')
  addCommentContainer!: ElementRef;
  projectId: any = localStorage.getItem('projectId');
  constructor(
    private elem: ElementRef,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private auth: AuthService,
    private messageService: NzMessageService
  ) {
    this.myForm();
  }
  ngOnInit() {
    this.projectForumsLoader = true;
    this.getProjectDetails();
  }
  ngAfterViewInit() {}
  currentUser: any = JSON.parse(this.auth.getCurrentUser() || '{}');
  myForm() {
    this.requiredForm = this.fb.group({
      comment: ['', [Validators.required]],
    });
  }
  showCommentBox() {
    this.addCommentContainer.nativeElement.style.display = 'block';
  }
  getDateAndTime() {
    var dateObj = new Date();
    var hours = dateObj.getHours();
    var minutes: any = dateObj.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var date = dateObj.getDate();
    var month = monthNames[dateObj.getMonth()];
    var year = dateObj.getFullYear();
    var strTime =
      hours +
      ':' +
      minutes +
      ' ' +
      ampm +
      ' ' +
      date +
      ' ' +
      month +
      ' ' +
      year;
    return strTime;
  }
  showText(value: any) {
    console.log(value);
    const elements =
      this.elem.nativeElement.querySelectorAll('.forum-description');
    const readMoreDiv =
      this.elem.nativeElement.querySelectorAll('.read-more-div');
    const readLessDiv =
      this.elem.nativeElement.querySelectorAll('.read-less-div');
    if (
      readMoreDiv[value].style.display == 'none' &&
      readLessDiv[value].style.display == 'block'
    ) {
      elements[value].style.height = '20px';
      elements[value].style.overflow = 'hidden';
      readMoreDiv[value].style.display = 'block';
      readLessDiv[value].style.display = 'none';
    } else {
      elements[value].style.height = 'auto';
      elements[value].style.overflow = 'auto';
      readMoreDiv[value].style.display = 'none';
      readLessDiv[value].style.display = 'block';
    }
  }
  openCommentsDrawer(forumId: any): void {
    this.getProjectDetails();
    this.currentForumId = forumId;
    this.visible = true;
  }
  closeCommentsDrawer(): void {
    this.visible = false;
    this.addCommentBtnLoading = false;
    this.addCommentContainer.nativeElement.style.display = 'none';
  }
  sortByTimeStamp(arr: any) {
    return arr.sort((a: any, b: any): any => {
      return <any>new Date(b.timeStamp) - <any>new Date(a.timeStamp);
    });
  }
  topVotedFunc(arr: any[]) {
    return arr.sort((a, b) => {
      return b.likedUserNames.length - a.likedUserNames.length;
    });
  }
  earliest(arr: any[]) {
    return arr.sort((a, b) => {
      return <any>new Date(a.timeStamp) - <any>new Date(b.timeStamp);
    });
  }
  sortForums(value: any) {
    this.selectedForumSort = value;
    if (value == 'default') {
      this.forumDetails = this.sortByTimeStamp(this.forumDetails);
    }
    if (value == 'Top Voted') {
      this.forumDetails = this.topVotedFunc(this.forumDetails);
    }
    if (value == 'Earliest') {
      this.forumDetails = this.earliest(this.forumDetails);
    }
  }

  sortComments(value: any) {
    this.selectedCommentSort = value;
    if (value == 'default') {
      this.commentDetails = this.sortByTimeStamp(this.copyCommentDetails);
    }
    if (value == 'Top Comments') {
      this.commentDetails = this.topVotedFunc(this.commentDetails);
    }
    if (value == 'Earliest') {
      this.commentDetails = this.earliest(this.commentDetails);
    }
  }
  searchInForums(value: any) {
    if (!value) {
      this.forumDetails = this.sortByTimeStamp(this.copyForumDetails);
      this.noSearchDataFound = false;
    } else {
      this.forumDetails = this.copyForumDetails.filter(
        (item: any) =>
          item['forumTitle'].toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      if (this.forumDetails.length == 0) {
        this.noSearchDataFound = true;
      } else {
        this.noSearchDataFound = false;
      }
    }
  }
  getProjectDetails() {
    this.projectService.getProjectDetails().subscribe((data: any) => {
      if (data.status) {
        this.projectForumsLoader = false;
        data.projectDetails.forEach((project: any) => {
          if (project._id == this.projectId) {
            this.forumDetails = project.forums;
            this.copyForumDetails = project.forums;
            this.sortByTimeStamp(project.forums);
            this.forumDetails.forEach((forum: any) => {
              if (forum.forumId == this.currentForumId) {
                this.commentDetails = forum.comments;
                this.copyCommentDetails = forum.comments;
                this.sortByTimeStamp(forum.comments);
              }
            });
            this.copyCommentDetails = this.commentDetails;
          }
        });
      } else {
        console.log(data.message);
      }
    });
  }
  likeProjectForum(forumId: any) {
    this.projectService
      .likeProjectForum(this.projectId, forumId, this.currentUser['userName'])
      .subscribe((data: any) => {
        if (data.status) {
          this.getProjectDetails();
          setTimeout(() => {
            this.messageService.create('success', data.message);
          }, 1000);
        } else {
          this.messageService.create(
            'error',
            'Something went wrong! Please try again'
          );
        }
      });
  }
  unLikeProjectForum(forumId: any) {
    this.projectService
      .unLikeProjectForum(this.projectId, forumId, this.currentUser['userName'])
      .subscribe((data: any) => {
        if (data.status) {
          this.getProjectDetails();
          setTimeout(() => {
            this.messageService.create('success', data.message);
          }, 1000);
        } else {
          this.messageService.create(
            'error',
            'Something went wrong! Please try again'
          );
        }
      });
  }
  addProjectForumComment() {
    this.submitted = true;
    if (this.requiredForm.valid) {
      this.addCommentBtnLoading = true;
      var timeStamp = this.getDateAndTime();
      this.projectService
        .addProjectForumComment(
          this.projectId,
          this.currentForumId,
          timeStamp,
          this.currentUser['fullName'],
          this.currentUser['userName'],
          this.requiredForm.value
        )
        .subscribe((data: any) => {
          if (data.status) {
            this.getProjectDetails();
            this.addCommentBtnLoading = false;
            setTimeout(() => {
              this.messageService.create('success', data.message);
            }, 1000);
          } else {
            this.addCommentBtnLoading = false;

            this.messageService.create(
              'error',
              'Something went wrong! Please try again'
            );
          }
        });
    } else {
      console.log('In-Valid');
    }
  }
  likeProjectForumComment(commentId: any) {
    this.projectService
      .likeProjectForumComment(
        this.projectId,
        this.currentForumId,
        commentId,
        this.currentUser['userName']
      )
      .subscribe((data: any) => {
        if (data.status) {
          this.getProjectDetails();
          setTimeout(() => {
            this.messageService.create('success', data.message);
          }, 1000);
        } else {
          this.messageService.create(
            'error',
            'Something went wrong! Please try again'
          );
        }
      });
  }
  unLikeProjectForumComment(commentId: any) {
    this.projectService
      .unLikeProjectForumComment(
        this.projectId,
        this.currentForumId,
        commentId,
        this.currentUser['userName']
      )
      .subscribe((data: any) => {
        if (data.status) {
          this.getProjectDetails();
          setTimeout(() => {
            this.messageService.create('success', data.message);
          }, 1000);
        } else {
          this.messageService.create(
            'error',
            'Something went wrong! Please try again'
          );
        }
      });
  }
  deleteProjectForum(forumId: any) {
    this.projectService
      .deleteProjectForum(this.projectId, forumId)
      .subscribe((data: any) => {
        if (data.status) {
          this.getProjectDetails();
          setTimeout(() => {
            this.messageService.create('success', data.message);
          }, 1000);
        } else {
          this.messageService.create(
            'error',
            'Something went wrong! Please try again'
          );
        }
      });
  }
  deleteProjectForumComment(commentId: any) {
    this.projectService
      .deleteProjectForumComment(this.projectId, this.currentForumId, commentId)
      .subscribe((data: any) => {
        if (data.status) {
          this.getProjectDetails();
          setTimeout(() => {
            this.messageService.create('success', data.message);
          }, 1000);
        } else {
          this.messageService.create(
            'error',
            'Something went wrong! Please try again'
          );
        }
      });
  }
}
