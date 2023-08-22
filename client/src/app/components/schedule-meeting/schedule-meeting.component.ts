import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { timeZones } from './time-zones/time-zones';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.css'],
})
export class ScheduleMeetingComponent implements OnInit {
  filledNav: String = 'filled-nav';
  filledNavUserContentColor: string = 'filled-nav-user-content-color';
  projectId: any = this.route.snapshot.paramMap.get('projectId');
  projectTitle: any = 'PMS Tool';
  recurrenceOptions = ['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
  timeZoneOptions = timeZones;
  submitted: boolean = false;
  requiredForm!: FormGroup;
  constructor(
    private router: Router,
    private bnIdle: BnNgIdleService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.myForm();
  }
  ngOnInit() {
    this.bnIdle.startWatching(300).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this.router.navigate([
          '/projects/auth/pass-key-system',
          this.projectId,
          this.projectTitle,
          {
            inActive: 'Due to 5 mins of inactivity, you have been logged out!',
          },
        ]);
      }
    });
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
  scheduleMeeting(event: Event) {
    this.submitted = true;
    if (this.requiredForm.valid) {
    } else {
    }
  }
}
