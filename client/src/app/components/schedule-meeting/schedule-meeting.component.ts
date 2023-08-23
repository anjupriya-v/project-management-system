import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { timeZones } from './time-zones/time-zones';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.css'],
})
export class ScheduleMeetingComponent implements OnInit {
  filledNav: String = 'filled-nav';
  filledNavUserContentColor: string = 'filled-nav-user-content-color';
  projectId: any = this.route.snapshot.paramMap.get('projectId');
  projectTitle: any = this.route.snapshot.paramMap.get('projectTitle');
  recurrenceOptions = ['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
  timeZoneOptions = timeZones;
  submitted: boolean = false;
  scheduleMeetingBtnLoading: boolean = false;
  requiredForm!: FormGroup;
  constructor(
    private router: Router,
    private bnIdle: BnNgIdleService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private messageService: NzMessageService
  ) {
    this.myForm();
  }
  ngOnInit() {
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
        .scheduleMeeting(this.projectId, this.requiredForm.value)
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
