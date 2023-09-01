import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { timeZones } from './time-zones/time-zones';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.css'],
})
export class ScheduleMeetingComponent {
  filledNav: String = 'filled-nav';
  filledNavUserContentColor: string = 'filled-nav-user-content-color';
  projectId: any = this.route.snapshot.paramMap.get('projectId');
  projectTitle: any = this.route.snapshot.paramMap.get('projectTitle');
  recurrenceOptions = ['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
  timeZoneOptions = timeZones;
  submitted: boolean = false;
  scheduleMeetingBtnLoading: boolean = false;
  requiredForm!: FormGroup;
  currentUser: any = JSON.parse(this.auth.getCurrentUser() || '{}');
  scheduleMeetingLoader: boolean = false;
  ngOnInit() {
    this.scheduleMeetingLoader = true;
    setTimeout(() => {
      this.scheduleMeetingLoader = false;
    }, 1000);
  }
  constructor(
    private router: Router,
    private bnIdle: BnNgIdleService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private messageService: NzMessageService,
    private auth: AuthService
  ) {
    this.myForm();
  }

  myForm() {
    this.requiredForm = this.fb.group({
      summary: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.minLength(80)]],
      startingDate: ['', Validators.required],
      startingTime: ['', Validators.required],
      endingDate: ['', Validators.required],
      endingTime: ['', Validators.required],
      timeZone: ['', Validators.required],
      recurrence: ['', Validators.required],
    });
  }
  getTodaysDate() {
    var today: any = new Date();
    var dd: any = today.getDate();
    var mm: any = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    return yyyy + '-' + mm + '-' + dd;
  }
  getRecurrence(value: any) {
    switch (value) {
      case 0:
        this.requiredForm.controls['recurrence'].setValue('Once');
        break;
      case 1:
        this.requiredForm.controls['recurrence'].setValue('Daily');
        break;
      case 2:
        this.requiredForm.controls['recurrence'].setValue('Weekly');
        break;
      case 3:
        this.requiredForm.controls['recurrence'].setValue('Monthly');
        break;
      case 4:
        this.requiredForm.controls['recurrence'].setValue('Yearly');
        break;
    }
  }
  scheduleMeeting(event: Event) {
    this.submitted = true;
    if (this.requiredForm.valid) {
      this.scheduleMeetingBtnLoading = true;
      this.getRecurrence(this.requiredForm.controls['recurrence'].value);
      this.projectService
        .scheduleMeeting(
          this.projectId,
          this.requiredForm.value,
          this.currentUser['fullName'],
          this.currentUser['userName']
        )
        .subscribe((data: any) => {
          if (data.status) {
            this.router.navigate([
              '/projects/project-dashboard/' + this.projectId,
              {
                isMeetingDrawerVisible: true,
              },
            ]);
            this.scheduleMeetingBtnLoading = false;
          } else {
            this.messageService.create('error', data.message);

            this.scheduleMeetingBtnLoading = false;
          }
        });
    } else {
    }
  }
}
