import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-highlighted-dates',
  templateUrl: './highlighted-dates.component.html',
  styleUrls: ['./highlighted-dates.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HighlightedDatesComponent {
  constructor(
    private projectService: ProjectService,
    private auth: AuthService
  ) {}
  projectActiveDays: any[] = [];
  userActiveDays: any[] = [];
  projectProgressDone: any[] = [];
  userProgressDone: any[] = [];
  private _datesArray: Date[] = [];
  currentUser: any = JSON.parse(this.auth.getCurrentUser() || '{}');

  @Input() track = '';
  selectedDate!: Date;
  @Input()
  get datesArray(): Date[] {
    return this._datesArray;
  }
  @Input() projectId = '';
  set datesArray(d: Date[]) {
    this._datesArray = d;
    this._setupClassFunction();
  }
  getProjectActiveDays(event: any) {
    this.projectService.getProjectDetails().subscribe((data: any) => {
      if (data.status) {
        this.projectProgressDone = [];
        data.projectDetails.forEach((project: any) => {
          if (project._id == this.projectId) {
            this.projectActiveDays = project.activeDays;
            this.projectActiveDays.forEach((projectActiveDay) => {
              if (
                new Date(projectActiveDay.timeStamp).getFullYear() ===
                  new Date(event).getFullYear() &&
                new Date(projectActiveDay.timeStamp).getDate() ===
                  new Date(event).getDate() &&
                new Date(projectActiveDay.timeStamp).getMonth() ===
                  new Date(event).getMonth()
              ) {
                this.projectProgressDone.push(projectActiveDay.progressDone);
              }
            });
          }
        });
      }
    });
  }
  getUserActiveDays(event: any) {
    this.projectService.getProjectDetails().subscribe((data: any) => {
      if (data.status) {
        this.userProgressDone = [];
        data.projectDetails.forEach((project: any) => {
          this.userActiveDays = project.activeDays;
          this.userActiveDays.forEach((userActiveDay: any) => {
            if (userActiveDay.userName == this.currentUser['userName']) {
              if (
                new Date(userActiveDay.timeStamp).getFullYear() ===
                  new Date(event).getFullYear() &&
                new Date(userActiveDay.timeStamp).getDate() ===
                  new Date(event).getDate() &&
                new Date(userActiveDay.timeStamp).getMonth() ===
                  new Date(event).getMonth()
              ) {
                this.userProgressDone.push(userActiveDay.progressDone);
              }
            }
          });
        });
      }
    });
  }
  dateClass!: (d: Date) => any;
  private _setupClassFunction() {
    this.dateClass = (d: Date) => {
      let selected = false;

      if (this._datesArray) {
        selected = this._datesArray.some(
          (item: Date) =>
            new Date(item).getFullYear() === d.getFullYear() &&
            new Date(item).getDate() === d.getDate() &&
            new Date(item).getMonth() === d.getMonth()
        );
      }
      return selected ? 'example-custom-date-class' : undefined;
    };
  }
}
