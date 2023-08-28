import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectDashboardComponent implements OnInit, AfterViewInit {
  filledNav: String = 'filled-nav';
  filledNavUserContentColor: any = 'filled-nav-user-content-color';
  isAssignTaskDrawerVisible = false;
  isForumModalVisible = false;
  requiredForm!: FormGroup;
  taskCommentRequiredForm!: FormGroup;
  public chart: any;
  listOfProgressStatus: any[] = [];
  iFrameUrl!: SafeResourceUrl;
  submitted: boolean = false;
  taskCommentFormSubmitted: boolean = false;
  isTeamMembersModalVisible = false;
  isProjectDescriptionVisible = false;
  isTaskCommentsModalVisible = false;
  isUploadWorkModalVisible = false;
  isViewUploadModalVisible = false;
  isApproveTaskModalVisible = false;
  isMeetingScheduled: any = this.route.snapshot.paramMap.get(
    'isMeetingDrawerVisible'
  );
  isMeetingsDrawerVisible = this.isMeetingScheduled ? true : false;
  projectTitle: any;
  projectDescription: any;
  deadline: any;
  teamMembers: any[] = [];
  copyTeamMembers: any[] = [];
  displayTeamMembers: any[] = [];
  taskDetails: any[] = [];
  copyTaskDetails: any[] = [];
  teamMembersUserNames: any[] = [];
  taskNotAssignedMembers: any[] = [];
  acceptedFile: any;
  currentTaskId: any;
  currentTaskCommentTitle: any;
  taskWorkFile: any = undefined;
  taskWorkDetails: any[] = [];
  progressDoneArray: any[] = [];
  selectedDefaultFileTypeOption: boolean = true;
  addCommentBtnLoading: boolean = false;
  uploadTaskWorkBtnLoading: boolean = false;
  approveBtnLoading: boolean = false;
  rejectBtnLoading: boolean = false;
  projectId: any = this.route.snapshot.paramMap.get('projectId');
  noTeamMembersListData: any = false;
  selectedTaskListFilter: any = 'default';
  notStartedTaskList: any[] = [];
  inProgressTaskList: any[] = [];
  underReviewTaskList: any[] = [];
  completedTaskList: any[] = [];
  filteredAssignees: any[] = [];
  teamMembersFullNames: any[] = [];
  taskNotStartedCount: any = 0;
  taskInProgressCount: any = 0;
  taskUnderReviewCount: any = 0;
  taskCompletedCount: any = 0;
  currentUserTaskCount: any = 0;
  taskAssignedSum: any;
  taskCompletedSum: any;
  totalTaskSum: any;
  completedPercentage: any;
  daysLeft: any;
  projectStatus: any;
  userSearchValue: any;
  filterNotSatisfiedMembers: any[] = [];
  today = new Date();
  activeDays: any[] = [];
  projectDashboardLoader: boolean = true;
  lastActiveMemberFullName: any;
  lastActiveMemberRole: any;
  lastActiveMemberProfileImage: any;
  chartProcessed: boolean = false;
  meetings: any[] = [];
  getDateAndTimeVal: any;
  projectProgress: any = 'projectProgress';
  isMeetingCancelled: boolean = false;
  cancelledMeetingSummary: any;
  isMeetingDeleted: boolean = false;
  deletedMeetingSummary: any;
  @ViewChild('forumsSection')
  forumsSection!: ElementRef;
  @ViewChild('inputFile', { static: false })
  inputFile!: ElementRef;
  @ViewChild('inputURL', { static: false })
  inputURL!: ElementRef;
  @ViewChild('taskListSearchValue')
  taskListSearchValue!: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private notification: NzNotificationService,
    private messageService: NzMessageService,
    private router: Router,
    private bnIdle: BnNgIdleService
  ) {
    this.iFrameUrl = sanitizer.bypassSecurityTrustResourceUrl(
      '/projects/project-forums'
    );
    this.myForm();
    this.taskCommentForm();
  }
  ngOnInit() {
    localStorage.setItem('projectId', this.projectId);
    setInterval(() => {
      this.getDateAndTimeVal = this.getDay() + ' ' + this.getDateAndTime();
    }, 1000);
    // this.bnIdle.startWatching(300).subscribe((isTimedOut: boolean) => {
    //   if (isTimedOut) {
    //     this.router.navigate([
    //       '/projects/auth/pass-key-system',
    //       this.projectId,
    //       this.projectTitle,
    //       {
    //         inActive: 'Due to 5 mins of inactivity, you have been logged out!',
    //       },
    //     ]);
    //   }
    // });

    setTimeout(() => {
      this.getProjectDetails();
    }, 500);
    setTimeout(() => {
      this.isMeetingScheduled = null;
    }, 5000);
  }

  ngAfterViewInit() {
    this.listOfProgressStatus = [
      { label: 'Not Started', value: 'Not Started' },
      { label: 'In Progress', value: 'In Progress' },
    ];
  }
  currentUser: any = JSON.parse(this.auth.getCurrentUser() || '{}');
  myForm() {
    this.requiredForm = this.fb.group({
      selectFileType: ['', Validators.required],
      taskWorkFile: [''],
      taskWorkURL: [''],
      comments: [''],
    });
  }
  getDay() {
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    return day[new Date().getDay()];
  }
  taskCommentForm() {
    this.taskCommentRequiredForm = this.fb.group({
      taskComment: ['', Validators.required],
    });
  }
  ViewForums() {
    this.forumsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  openAssignTaskDrawer(): void {
    this.isAssignTaskDrawerVisible = true;
  }
  closeAssignTaskDrawer(): void {
    this.isAssignTaskDrawerVisible = false;
  }
  closeAssignTaskDrawerFromChild(value: boolean): void {
    this.isAssignTaskDrawerVisible = value;
    setTimeout(() => {
      this.getProjectDetails();
    }, 500);
  }
  showProjectDescriptionModal() {
    this.isProjectDescriptionVisible = true;
  }
  handleCloseProjectDescriptionModal() {
    this.isProjectDescriptionVisible = false;
  }
  showTeamMembersModal(): void {
    this.isTeamMembersModalVisible = true;
  }
  handleCloseTeamMembersModal(): void {
    this.isTeamMembersModalVisible = false;
  }
  showTaskCommentModal(taskName: any, taskId: any): void {
    this.currentTaskCommentTitle = `Comment for the Task '${taskName}'`;
    this.currentTaskId = taskId;
    this.isTaskCommentsModalVisible = true;
  }
  handleCloseTaskCommentModal(): void {
    this.isTaskCommentsModalVisible = false;
  }
  showForumCreateModal(): void {
    this.isForumModalVisible = true;
  }
  handleCloseForumCreateModal(value: boolean): void {
    this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      '/projects/project-forums'
    );
    this.isForumModalVisible = value;
  }
  showUploadWorkModal(taskId: any): void {
    this.isUploadWorkModalVisible = true;
    this.currentTaskId = taskId;
  }
  handleCloseUploadWorkModal(): void {
    this.submitted = false;
    this.selectedDefaultFileTypeOption = true;
    this.requiredForm.controls['selectFileType'].setValue('');
    this.requiredForm.controls['taskWorkFile'].setValue('');
    this.requiredForm.controls['taskWorkURL'].setValue('');
    this.requiredForm.controls['comments'].setValue('');
    this.isUploadWorkModalVisible = false;
  }
  showViewUploadModal(taskId: any): void {
    this.getTaskWorkDetails(taskId);
    this.isViewUploadModalVisible = true;
  }
  handleCloseViewUploadModal(): void {
    this.isViewUploadModalVisible = false;
    setTimeout(() => {
      this.getProjectDetails();
    }, 500);
  }
  showApproveTaskModal(taskId: any) {
    this.getTaskWorkDetails(taskId);
    this.currentTaskId = taskId;
    this.isApproveTaskModalVisible = true;
  }
  handleCloseApproveTaskModal() {
    this.isApproveTaskModalVisible = false;
    setTimeout(() => {
      this.getProjectDetails();
    }, 500);
  }
  showMeetingsDrawer() {
    this.isMeetingsDrawerVisible = true;
  }
  closeMeetingsDrawer() {
    this.isMeetingsDrawerVisible = false;
  }
  isKeyInArray(array: any[], key: any) {
    return array.some((obj) => obj.hasOwnProperty(key));
  }
  cancelMarkAsComplete(): void {}

  confirmMarkAsComplete(): void {
    if (this.taskAssignedSum == 0) {
      this.projectService
        .changeProjectStatus(this.projectId)
        .subscribe((data: any) => {
          if (data.status) {
            this.notification.success('Status', data.message, {
              nzPlacement: 'bottomRight',
            });
            this.router.navigate(['/projects']);
          } else {
            this.notification.error('Status', data.message, {
              nzPlacement: 'bottomRight',
            });
          }
        });
    } else {
      if (this.taskAssignedSum == 1) {
        this.messageService.create(
          'error',
          `${this.taskAssignedSum} task is pending☹️...Try to Complete`
        );
      } else {
        this.messageService.create(
          'error',
          `${this.taskAssignedSum} tasks are pending☹️...Try to Complete`
        );
      }
    }
  }
  cancelDeleteProject(): void {}
  confirmDeleteProject(projectId: any, projectTitle: any) {
    this.projectService
      .deleteProject(projectId, projectTitle)
      .subscribe((data: any) => {
        if (data.status) {
          this.notification.success('Deletion', data.message, {
            nzPlacement: 'bottomRight',
          });
          this.router.navigate(['/projects']);
        } else {
          this.notification.error('Deletion', data.message, {
            nzPlacement: 'bottomRight',
          });
        }
      });
  }
  getPieChart() {
    Chart.register(...registerables);
    const canvas = <HTMLCanvasElement>document.getElementById('MyChart');
    const ctx: any = canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'pie',

      data: {
        labels: ['Not Started', 'In Progress', 'Under Review', 'Completed'],
        datasets: [
          {
            label: 'Progress Status',
            data: [
              this.taskNotStartedCount,
              this.taskInProgressCount,
              this.taskUnderReviewCount,
              this.taskCompletedCount,
            ],
            backgroundColor: [
              'rgb(255, 139, 139)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(124, 216, 124)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
  filterNotSatisfiedMembersFunc(teamMembers: any[], taskDetails: any[]) {
    var notSatisfiedMember = '';
    this.filterNotSatisfiedMembers = [];
    if (taskDetails.length > 0) {
      taskDetails.forEach((task: any) => {
        notSatisfiedMember = task.assignee;
        teamMembers.forEach((teamMember): any => {
          if (teamMember.userName == task.assignee) {
            notSatisfiedMember = '';
            return false;
          }
        });
        if (notSatisfiedMember != '') {
          if (!this.taskNotAssignedMembers.includes(notSatisfiedMember)) {
            this.filterNotSatisfiedMembers.push(notSatisfiedMember);
          }
        }
      });
    } else {
      this.copyTaskDetails.forEach((task: any) => {
        notSatisfiedMember = task.assignee;
        if (!this.taskNotAssignedMembers.includes(notSatisfiedMember)) {
          this.filterNotSatisfiedMembers.push(notSatisfiedMember);
        }
      });
    }
  }
  searchByProgressStatus(userListSearchValue: any, progressStatusArr: any[]) {
    var tempTeamMembersList: any[] = [];

    if (progressStatusArr.length > 0) {
      this.teamMembers.forEach((teamMember) => {
        progressStatusArr.forEach((task) => {
          if (teamMember.userName == task.assignee) {
            if (tempTeamMembersList.includes(teamMember)) {
              tempTeamMembersList.push(teamMember);
            }
          }
        });
      });
      this.teamMembers = Object.assign([], tempTeamMembersList).filter(
        (item: any) =>
          item['fullName']
            .toLowerCase()
            .indexOf(userListSearchValue.toLowerCase()) > -1 &&
          this.filterNotSatisfiedMembers.includes(item['userName'])
      );
    } else {
      this.teamMembers = Object.assign([], this.copyTeamMembers).filter(
        (item: any) =>
          item['fullName']
            .toLowerCase()
            .indexOf(userListSearchValue.toLowerCase()) > -1 &&
          this.filterNotSatisfiedMembers.includes(item['userName'])
      );
    }
    this.filterNotSatisfiedMembersFunc(this.teamMembers, this.taskDetails);
  }
  searchInTaskList(userListSearchValue: any) {
    this.userSearchValue = userListSearchValue;
    if (this.selectedTaskListFilter == 'Not Started') {
      if (!userListSearchValue) {
        this.filterNotSatisfiedMembersFunc(
          this.copyTeamMembers,
          this.notStartedTaskList
        );
        this.teamMembers = this.copyTeamMembers;
        this.noTeamMembersListData = false;
        return;
      } else {
        this.searchByProgressStatus(
          this.userSearchValue,
          this.notStartedTaskList
        );
      }
    }

    if (this.selectedTaskListFilter == 'In Progress') {
      if (!userListSearchValue) {
        this.filterNotSatisfiedMembersFunc(
          this.copyTeamMembers,
          this.inProgressTaskList
        );
        this.teamMembers = this.copyTeamMembers;
        this.noTeamMembersListData = false;
        return;
      } else {
        this.searchByProgressStatus(
          this.userSearchValue,
          this.inProgressTaskList
        );
      }
    }
    if (this.selectedTaskListFilter == 'Under Review') {
      if (!userListSearchValue) {
        this.filterNotSatisfiedMembersFunc(
          this.copyTeamMembers,
          this.underReviewTaskList
        );
        this.teamMembers = this.copyTeamMembers;
        this.noTeamMembersListData = false;
        return;
      } else {
        this.searchByProgressStatus(
          this.userSearchValue,
          this.underReviewTaskList
        );
      }
    }
    if (this.selectedTaskListFilter == 'Completed') {
      if (!userListSearchValue) {
        this.filterNotSatisfiedMembersFunc(
          this.copyTeamMembers,
          this.completedTaskList
        );
        this.teamMembers = this.copyTeamMembers;
        this.noTeamMembersListData = false;
        return;
      } else {
        this.searchByProgressStatus(
          this.userSearchValue,
          this.completedTaskList
        );
      }
    }

    if (this.selectedTaskListFilter == 'Task Not Assigned Members') {
      if (!this.userSearchValue) {
        this.filterNotSatisfiedMembersFunc(
          this.copyTeamMembers,
          this.copyTaskDetails
        );
        this.teamMembers = this.copyTeamMembers;
        this.noTeamMembersListData = false;
        return;
      } else {
        this.teamMembers = Object.assign([], this.copyTeamMembers).filter(
          (item: any) =>
            item['fullName']
              .toLowerCase()
              .indexOf(userListSearchValue.toLowerCase()) > -1 &&
            this.taskNotAssignedMembers.includes(item['userName'])
        );
      }
    }
    if (this.selectedTaskListFilter == 'default') {
      if (!this.userSearchValue) {
        this.filterNotSatisfiedMembersFunc(
          this.copyTeamMembers,
          this.copyTaskDetails
        );
        this.teamMembers = this.copyTeamMembers;
        this.noTeamMembersListData = false;
        return;
      } else {
        this.teamMembers = Object.assign([], this.copyTeamMembers).filter(
          (item: any) =>
            item['fullName']
              .toLowerCase()
              .indexOf(userListSearchValue.toLowerCase()) > -1 &&
            this.taskNotAssignedMembers.includes(item['userName'])
        );
      }
    }
    if (this.teamMembers.length == 0) {
      this.noTeamMembersListData = true;
    } else {
      this.noTeamMembersListData = false;
    }
  }
  filterFunc(taskList: any[], value: any) {
    return Object.assign([], taskList).filter(
      (item: any) =>
        item['progressStatus'].toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }
  getFilteredAssignees(taskList: any[]) {
    if (taskList.length == 0) {
      this.filteredAssignees = [];
    } else {
      Object.assign([], taskList).map((element: any) => {
        this.filteredAssignees.push(element.assignee);
      });
    }
  }

  filterTaskList(value: any) {
    this.filteredAssignees = [];
    this.selectedTaskListFilter = value;
    var tempTaskList: any[] = [];
    if (value == 'default') {
      if (this.userSearchValue) {
        this.taskDetails = this.copyTaskDetails;
      } else {
        this.teamMembers.forEach((teamMember) => {
          this.copyTaskDetails.forEach((task) => {
            if (teamMember.userName == task.assignee) {
              tempTaskList.push(task);
            }
          });
        });
        this.taskDetails = tempTaskList;
      }
      this.getFilteredAssignees(this.copyTaskDetails);
      this.filterNotSatisfiedMembersFunc(
        this.copyTeamMembers,
        this.copyTaskDetails
      );
    } else {
      if (value == 'Not Started') {
        if (this.userSearchValue) {
          this.teamMembers.forEach((teamMember) => {
            this.copyTaskDetails.forEach((task) => {
              if (teamMember.userName == task.assignee) {
                tempTaskList.push(task);
              }
            });
          });
          this.notStartedTaskList = this.filterFunc(tempTaskList, value);
        } else {
          this.notStartedTaskList = this.filterFunc(
            this.copyTaskDetails,
            value
          );
        }
        this.getFilteredAssignees(this.notStartedTaskList);

        this.taskDetails = this.notStartedTaskList;
        this.filterNotSatisfiedMembersFunc(this.teamMembers, this.taskDetails);
      }
      if (value == 'In Progress') {
        if (this.userSearchValue) {
          this.teamMembers.forEach((teamMember) => {
            this.copyTaskDetails.forEach((task) => {
              if (teamMember.userName == task.assignee) {
                tempTaskList.push(task);
              }
            });
          });
          this.inProgressTaskList = this.filterFunc(tempTaskList, value);
        } else {
          this.inProgressTaskList = this.filterFunc(
            this.copyTaskDetails,
            value
          );
        }
        this.getFilteredAssignees(this.inProgressTaskList);

        this.taskDetails = this.inProgressTaskList;
        this.filterNotSatisfiedMembersFunc(this.teamMembers, this.taskDetails);
      }
      if (value == 'Under Review') {
        if (this.userSearchValue) {
          this.teamMembers.forEach((teamMember) => {
            this.copyTaskDetails.forEach((task) => {
              if (teamMember.userName == task.assignee) {
                tempTaskList.push(task);
              }
            });
          });
          this.underReviewTaskList = this.filterFunc(tempTaskList, value);
        } else {
          this.underReviewTaskList = this.filterFunc(
            this.copyTaskDetails,
            value
          );
        }
        this.getFilteredAssignees(this.underReviewTaskList);

        this.taskDetails = this.underReviewTaskList;
        this.filterNotSatisfiedMembersFunc(this.teamMembers, this.taskDetails);
      }
      if (value == 'Completed') {
        if (this.userSearchValue) {
          this.teamMembers.forEach((teamMember) => {
            this.copyTaskDetails.forEach((task) => {
              if (teamMember.userName == task.assignee) {
                tempTaskList.push(task);
              }
            });
          });
          this.completedTaskList = this.filterFunc(tempTaskList, value);
        } else {
          this.completedTaskList = this.filterFunc(this.copyTaskDetails, value);
        }
        this.getFilteredAssignees(this.completedTaskList);

        this.taskDetails = this.completedTaskList;
        this.filterNotSatisfiedMembersFunc(this.teamMembers, this.taskDetails);
      }
    }
    if (value == 'Task Not Assigned Members') {
      this.taskListSearchValue.nativeElement.value = '';
      this.taskDetails = this.copyTaskDetails;
      this.teamMembers = this.copyTeamMembers;
    }
  }

  submitUserRating(rating: any, userName: any) {
    this.projectService
      .submitUserRating(rating, userName, this.projectId)
      .subscribe((data: any) => {
        if (data.status) {
          setTimeout(() => {
            this.getProjectDetails();
          }, 500);
          this.notification.success('Rating', data.message, {
            nzPlacement: 'bottomRight',
          });
        } else {
          this.notification.error('Rating', data.message, {
            nzPlacement: 'bottomRight',
          });
        }
      });
  }
  changeTaskProgressStatus(event: Event, taskId: any) {
    this.projectService
      .changeTaskProgressStatus(this.projectId, event, taskId)
      .subscribe((data: any) => {
        if (data.status) {
          setTimeout(() => {
            this.getProjectDetails();
          }, 500);
        }
      });
  }
  handleSelectFile(selectFileType: any) {
    if (selectFileType == 'link') {
      this.requiredForm
        .get('taskWorkURL')
        ?.setValidators([Validators.required]);
      this.requiredForm.get('taskWorkURL')?.updateValueAndValidity();
      this.requiredForm.controls['taskWorkFile']?.clearValidators();
      this.requiredForm.get('taskWorkFile')?.updateValueAndValidity();
      this.inputURL.nativeElement.style.display = 'block';
      this.inputFile.nativeElement.style.display = 'none';
    } else {
      this.requiredForm
        .get('taskWorkFile')
        ?.setValidators([Validators.required]);
      this.requiredForm.get('taskWorkFile')?.updateValueAndValidity();
      this.requiredForm.controls['taskWorkURL']?.clearValidators();
      this.requiredForm.get('taskWorkURL')?.updateValueAndValidity();
      this.inputFile.nativeElement.style.display = 'block';
      this.inputURL.nativeElement.style.display = 'none';
      if (selectFileType == 'image') {
        this.acceptedFile = '.jpg,.jpeg,.png';
      }
      if (selectFileType == 'pdf') {
        this.acceptedFile = '.pdf';
      }
      if (selectFileType == 'text') {
        this.acceptedFile = '.txt';
      }
      if (selectFileType == 'word') {
        this.acceptedFile = '.doc,.docx';
      }
      if (selectFileType == 'powerpoint') {
        this.acceptedFile = '.ppt, .pptx';
      }
      if (selectFileType == 'excel') {
        this.acceptedFile = '.xls,.xlsb,.xlsm,.xlsx';
      }
    }
  }
  uploadTaskWorkFile(event: Event) {
    const target = event.target as HTMLInputElement;
    this.taskWorkFile = (target.files as FileList)[0];
  }
  handleProjectServiceTaskUpload(taskWork: any, comments: any) {
    this.projectService
      .uploadTaskWork(taskWork, comments, this.projectId, this.currentTaskId)
      .subscribe((data: any) => {
        if (data.status) {
          this.isUploadWorkModalVisible = false;
          this.uploadTaskWorkBtnLoading = false;
          this.notification.success('Task Upload', data.message, {
            nzPlacement: 'bottomRight',
          });
          setTimeout(() => {
            this.getProjectDetails();
          }, 500);
        } else {
          this.uploadTaskWorkBtnLoading = false;

          this.notification.error(
            'Task Upload',
            'Something went wrong! Please try again',
            {
              nzPlacement: 'bottomRight',
            }
          );
        }
      });
  }
  getTaskWorkDetails(taskId: any) {
    this.projectService
      .getTaskWorkDetails(taskId, this.projectId)
      .subscribe((data: any) => {
        if (data.status) {
          this.taskWorkDetails = data.taskWorkDetails[0].tasks;
        }
      });
  }
  submitTaskWork(event: Event) {
    this.submitted = true;
    if (this.requiredForm.valid) {
      this.uploadTaskWorkBtnLoading = true;
      if (this.taskWorkFile == undefined) {
        this.handleProjectServiceTaskUpload(
          this.requiredForm.controls['taskWorkURL'].value,
          this.requiredForm.controls['comments'].value
        );
        this.taskWorkFile = undefined;
      } else {
        this.handleProjectServiceTaskUpload(
          this.taskWorkFile,
          this.requiredForm.controls['comments'].value
        );
      }
    } else {
      console.log('In valid');
    }
  }
  taskApproval(approvalStatus: any, progressStatus: any) {
    if (approvalStatus == 'Approved') {
      this.approveBtnLoading = true;
    } else {
      this.rejectBtnLoading = true;
    }
    this.projectService
      .taskApproval(
        progressStatus,
        approvalStatus,
        this.currentTaskId,
        this.projectId
      )
      .subscribe((data: any) => {
        if (data.status) {
          setTimeout(() => {
            this.getProjectDetails();
          }, 500);
          this.notification.success('Task Approval', data.message, {
            nzPlacement: 'bottomRight',
          });
          this.approveBtnLoading = false;
          this.rejectBtnLoading = false;
          this.isApproveTaskModalVisible = false;
        } else {
          this.notification.error('Task Approval', data.message, {
            nzPlacement: 'bottomRight',
          });
          this.approveBtnLoading = false;
          this.rejectBtnLoading = false;
        }
      });
  }
  reSubmitTask(taskId: any) {
    this.projectService
      .reSubmitTask(this.projectId, taskId)
      .subscribe((data: any) => {
        if (data.status) {
          this.notification.success('Re-Submit Task', data.message, {
            nzPlacement: 'bottomRight',
          });
          setTimeout(() => {
            this.getProjectDetails();
          }, 500);
        } else {
          this.notification.error(
            'Re-Submit Task',
            'Something Went Wrong! Please try again',
            {
              nzPlacement: 'bottomRight',
            }
          );
        }
      });
  }
  getTime(dateObj: any) {
    var hours = dateObj.getHours();
    var minutes: any = dateObj.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  }
  getDateFormat() {
    var dateObj = new Date();
    var date = dateObj.getDate();
    var month = dateObj.getMonth() + 1;
    var year = dateObj.getFullYear();
    return year + '-' + month + '-' + date;
  }
  getDate() {
    var dateObj = new Date();
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
    var date = dateObj.getDate();
    var month = monthNames[dateObj.getMonth()];
    var year = dateObj.getFullYear();
    return date + ' ' + month + ' ' + year;
  }
  getDateAndTime() {
    var dateObj = new Date();
    var date = this.getDate();
    var time = this.getTime(dateObj);
    var strTime = date + ' ' + time;
    return strTime;
  }
  submitTaskCommentForm(event: Event) {
    this.taskCommentFormSubmitted = true;
    if (this.taskCommentRequiredForm.valid) {
      this.addCommentBtnLoading = true;
      this.projectService
        .addTaskComment(
          this.taskCommentRequiredForm.controls['taskComment'].value,
          this.projectId,
          this.currentTaskId,
          this.currentUser['userName'],
          this.currentUser['fullName'],
          this.currentUser['role'],
          this.getDateAndTime()
        )
        .subscribe((data: any) => {
          if (data.status) {
            this.taskCommentFormSubmitted = false;
            this.taskCommentRequiredForm.controls['taskComment'].setValue('');
            this.addCommentBtnLoading = false;
            this.notification.success('Task Comment', data.message, {
              nzPlacement: 'bottomRight',
            });
            setTimeout(() => {
              this.getProjectDetails();
            }, 500);
          } else {
            this.addCommentBtnLoading = false;
            this.notification.error(
              'Task Comment',
              'Something Went Wrong! Please try again',
              {
                nzPlacement: 'bottomRight',
              }
            );
          }
        });
      console.log('Valid');
    } else {
      console.log('Invalid form');
    }
  }
  likeTaskComment(commentId: any) {
    this.projectService
      .likeTaskComment(
        this.projectId,
        this.currentTaskId,
        commentId,
        this.currentUser['userName']
      )
      .subscribe((data: any) => {
        if (data.status) {
          setTimeout(() => {
            this.getProjectDetails();
          }, 500);
          this.messageService.create('success', data.message);
        } else {
          this.messageService.create(
            'error',
            'Something went wrong! Please try again'
          );
        }
      });
  }
  unLikeTaskComment(commentId: any) {
    this.projectService
      .unLikeTaskComment(
        this.projectId,
        this.currentTaskId,
        commentId,
        this.currentUser['userName']
      )
      .subscribe((data: any) => {
        if (data.status) {
          setTimeout(() => {
            this.getProjectDetails();
          }, 500);
          this.messageService.create('success', data.message);
        } else {
          this.messageService.create(
            'error',
            'Something went wrong! Please try again'
          );
        }
      });
  }
  deleteTask(taskId: any) {
    this.projectService
      .deleteTask(this.projectId, taskId)
      .subscribe((data: any) => {
        if (data.status) {
          setTimeout(() => {
            this.getProjectDetails();
          }, 500);
          this.notification.success('Deletion', data.message, {
            nzPlacement: 'bottomRight',
          });
        } else {
          this.notification.error(
            'Deletion',
            'Something Went Wrong! Try again',
            {
              nzPlacement: 'bottomRight',
            }
          );
        }
      });
  }
  deleteTaskComment(taskId: any, commentId: any) {
    this.projectService
      .deleteTaskComment(this.projectId, taskId, commentId)
      .subscribe((data: any) => {
        if (data.status) {
          setTimeout(() => {
            this.getProjectDetails();
          }, 500);
          this.messageService.create('success', data.message);
        } else {
          this.messageService.create(
            'error',
            'Something went wrong! try again'
          );
        }
      });
  }
  cancelMeeting(meetingId: any, meetingSummary: any) {
    this.projectService
      .cancelMeeting(this.projectId, meetingId)
      .subscribe((data: any) => {
        if (data.status) {
          this.isMeetingCancelled = data.status;
          this.cancelledMeetingSummary = meetingSummary;
          this.getProjectDetails();
          setTimeout(() => {
            this.isMeetingCancelled = false;
          }, 5000);
        } else {
          console.log(data.message);
        }
      });
  }
  deleteMeeting(meetingId: any, meetingSummary: any) {
    this.projectService
      .deleteMeeting(this.projectId, meetingId)
      .subscribe((data: any) => {
        if (data.status) {
          this.isMeetingDeleted = data.status;
          this.deletedMeetingSummary = meetingSummary;
          this.getProjectDetails();
          setTimeout(() => {
            this.isMeetingDeleted = false;
          }, 5000);
        } else {
          this.isMeetingDeleted = data.status;
          this.deletedMeetingSummary = data.message;
          setTimeout(() => {
            this.isMeetingDeleted = false;
          }, 5000);
        }
      });
  }
  sortBasedOnPriority(priority: any, tasks: any[]) {
    tasks.forEach((task) => {
      if (task.priority == priority) {
        this.taskDetails.push(task);
      }
    });
  }
  daysLeftFunc(deadline: any) {
    var today = new Date();
    var date_to_reply = new Date(deadline);
    var timeinmilisec = date_to_reply.getTime() - today.getTime();
    return Math.ceil(timeinmilisec / (500 * 60 * 60 * 24));
  }
  getDateObj(date: any): any {
    if (date == 'now') {
      return new Date();
    }
    return new Date(date);
  }
  getProjectDetails = () => {
    this.projectService.getProjectDetails().subscribe((data: any) => {
      if (data.status) {
        this.teamMembers = [];
        this.taskDetails = [];
        this.taskAssignedSum = 0;
        this.taskCompletedSum = 0;
        this.copyTeamMembers = [];
        this.activeDays = [];
        this.teamMembersUserNames = [];
        this.teamMembersFullNames = [];
        this.progressDoneArray = [];
        this.currentUserTaskCount = 0;
        this.taskNotStartedCount = 0;
        this.taskInProgressCount = 0;
        this.taskUnderReviewCount = 0;
        this.taskCompletedCount = 0;

        var assignedTask = 0,
          completedTask = 0;
        var notAssignedMember = '';
        this.taskNotAssignedMembers = [];
        data.projectDetails.forEach((project: any) => {
          if (project._id == this.projectId) {
            this.projectTitle = project.projectTitle;
            this.projectDescription = project.projectDescription;
            this.deadline = project.deadline;
            this.projectStatus = project.status;
            this.displayTeamMembers = project.teamMembers;
            this.progressDoneArray = project.activeDays;
            this.meetings = project.meetings;
            this.sortBasedOnPriority('High Priority', project.tasks);
            this.sortBasedOnPriority('Medium Priority', project.tasks);
            this.sortBasedOnPriority('Low Priority', project.tasks);
            this.copyTaskDetails = this.taskDetails;
            this.getFilteredAssignees(this.copyTaskDetails);
            project.teamMembers.forEach((teamMember: any) => {
              if (
                teamMember.userName == this.currentUser['userName'] &&
                !(teamMember.role == 'Admin' || teamMember.role == 'Team Lead')
              ) {
                this.teamMembers.push(teamMember);
              }
            });
            project.teamMembers.forEach((teamMember: any) => {
              if (
                teamMember.role == 'Admin' ||
                teamMember.role == 'Team Lead'
              ) {
                this.teamMembers.push(teamMember);
              }
            });
            project.teamMembers.forEach((teamMember: any) => {
              if (
                teamMember.userName != this.currentUser['userName'] &&
                teamMember.role != 'Admin' &&
                teamMember.role != 'Team Lead'
              ) {
                this.teamMembers.push(teamMember);
              }
            });
            this.teamMembers.forEach((teamMember) => {
              this.copyTeamMembers.push(teamMember);
            });
            var result = this.progressDoneArray.reduce((a: any, b: any) =>
              new Date(a.timeStamp) > new Date(b.timeStamp) ? a : b
            );
            this.lastActiveMemberFullName = result.fullName;
            this.lastActiveMemberProfileImage = result.profileImage;
            this.lastActiveMemberRole = result.role;
            this.progressDoneArray.forEach((projectActiveDay: any) => {
              this.activeDays.push(projectActiveDay.timeStamp);
            });
          }
        });

        this.copyTeamMembers.forEach((teamMember) => {
          notAssignedMember = teamMember.userName;
          this.copyTaskDetails.forEach((task): any => {
            if (teamMember.userName == task.assignee) {
              notAssignedMember = '';
              return false;
            }
          });
          if (notAssignedMember != '') {
            if (!this.taskNotAssignedMembers.includes(notAssignedMember)) {
              this.taskNotAssignedMembers.push(notAssignedMember);
            }
          }
        });
        this.copyTaskDetails.forEach((task) => {
          if (
            this.currentUser['userName'] == task.assignee &&
            task.approvalStatus != 'Approved'
          ) {
            this.currentUserTaskCount++;
          }
          if (task.progressStatus == 'Not Started') {
            this.taskNotStartedCount++;
          }
          if (task.progressStatus == 'In Progress') {
            this.taskInProgressCount++;
          }
          if (task.progressStatus == 'Under Review') {
            this.taskInProgressCount++;
          }
          if (task.progressStatus == 'Completed') {
            this.taskCompletedCount++;
          }
        });

        this.copyTeamMembers.forEach((teamMember) => {
          this.teamMembersUserNames.push(teamMember.userName);
          this.teamMembersFullNames.push(teamMember.fullName);
          this.copyTaskDetails.forEach((task) => {
            if (teamMember.userName == task.assignee) {
              if (task.approvalStatus == 'Approved') {
                completedTask++;
              } else {
                assignedTask++;
              }
            }
          });
          this.taskAssignedSum += assignedTask;
          this.taskCompletedSum += completedTask;

          assignedTask = 0;
          completedTask = 0;
        });
        this.totalTaskSum = this.taskAssignedSum + this.taskCompletedSum;
        var rounded =
          Math.round((this.taskCompletedSum / this.totalTaskSum) * 10) / 10;
        this.completedPercentage = rounded * 100;
        this.daysLeft = this.daysLeftFunc(this.deadline);
        this.projectDashboardLoader = false;
        if (
          this.taskNotStartedCount != 0 ||
          this.taskInProgressCount != 0 ||
          this.taskUnderReviewCount != 0 ||
          this.taskCompletedCount != 0
        ) {
          this.chartProcessed = true;
          setTimeout(() => {
            if (this.chart != null) {
              this.chart.destroy();
            }
            this.getPieChart();
          }, 2000);
        } else {
          this.chartProcessed = false;
        }
      }
    });
  };
}
