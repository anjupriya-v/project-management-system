import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-create-project-forum-post',
  templateUrl: './create-project-forum-post.component.html',
  styleUrls: ['./create-project-forum-post.component.css'],
})
export class CreateProjectForumPostComponent {
  requiredForm!: FormGroup;
  submitted: boolean = false;
  createForumPostBtnLoading: boolean = false;
  currentUser: any = JSON.parse(this.auth.getCurrentUser() || '{}');
  @Input() projectId = '';
  @Output() forumPostCreationCompleted = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private notification: NzNotificationService,
    private auth: AuthService
  ) {
    this.myForm();
  }
  myForm() {
    this.requiredForm = this.fb.group({
      forumPostTitle: ['', [Validators.required, Validators.maxLength(15)]],
      forumPostDescription: [
        '',
        [Validators.required, Validators.minLength(60)],
      ],
    });
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
  submitForumDiscussion() {
    this.submitted = true;
    if (this.requiredForm.valid) {
      this.createForumPostBtnLoading = true;
      var getDateAndTime = this.getDateAndTime();
      this.projectService
        .createProjectForumPost(
          this.projectId,
          this.requiredForm.value,
          getDateAndTime,
          this.currentUser['fullName'],
          this.currentUser['userName'],
          this.currentUser['role'],
          this.currentUser['profileImage']
        )
        .subscribe((data: any) => {
          if (data.status) {
            this.forumPostCreationCompleted.emit(false);
            this.createForumPostBtnLoading = false;
            this.notification.success('Status', data.message, {
              nzPlacement: 'bottomRight',
            });
          } else {
            this.createForumPostBtnLoading = false;
            this.notification.error(
              'Status',
              'Something Went Wrong! Please Try Again',
              {
                nzPlacement: 'bottomRight',
              }
            );
          }
        });
      console.log('valid');
    } else {
      console.log('In-Valid');
    }
  }
}
