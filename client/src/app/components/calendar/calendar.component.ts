import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  filledNav: String = 'filled-nav';
  filledNavUserContentColor: any = 'filled-nav-user-content-color';
  currentUser: any = JSON.parse(this.auth.getCurrentUser() || '{}');
  deadlineList: any[] = [];
  constructor(
    private projectService: ProjectService,
    private auth: AuthService
  ) {}
  ngOnInit() {
    this.getProjectDetails();
  }
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    height: 590,
  };
  daysLeftFunc(deadline: any) {
    var today = new Date();
    var date_to_reply = new Date(deadline);
    var timeinmilisec = date_to_reply.getTime() - today.getTime();
    return Math.ceil(timeinmilisec / (500 * 60 * 60 * 24));
  }
  getProjectDetails() {
    this.projectService.getProjectDetails().subscribe((data: any) => {
      this.deadlineList = [];
      if (data.status) {
        data.projectDetails.forEach((project: any) => {
          project.teamMembers.forEach((teamMember: any) => {
            if (teamMember.userName == this.currentUser['userName']) {
              if (
                project.status != 'Completed' &&
                this.daysLeftFunc(project.deadline) >= 0
              ) {
                var projectDeadline = {
                  title: `${project.projectTitle}`,
                  start: new Date(),
                  end: new Date(project.deadline),
                  backgroundColor: 'rgb(255, 183, 183)',
                  textColor: 'black',
                };
                this.deadlineList.push(projectDeadline);
              }
              if (
                project.status != 'Completed' &&
                this.daysLeftFunc(project.deadline) < 0
              ) {
                var dealine = {
                  title: `${project.projectTitle}`,
                  start: new Date(project.deadline),
                  end: new Date(project.deadline),
                  color: 'red',
                };
                this.deadlineList.push(dealine);
              }
            }
          });
          project.tasks.forEach((task: any) => {
            if (task.assignee == this.currentUser['userName']) {
              if (
                task.approvalStatus != 'Approved' &&
                this.daysLeftFunc(task.deadline) >= 0
              ) {
                var taskDeadline = {
                  title: `${task.taskName}`,
                  start: new Date(),
                  end: new Date(task.deadline),
                  backgroundColor: 'rgb(255, 212, 133)',
                  textColor: 'black',
                };
                this.deadlineList.push(taskDeadline);
              }
            }
            if (
              task.approvalStatus != 'Approved' &&
              this.daysLeftFunc(task.deadline) < 0
            ) {
              var deadline = {
                title: `${task.taskName}`,
                start: new Date(task.deadline),
                end: new Date(task.deadline),
                color: 'rgb(71, 30, 255)',
              };
              this.deadlineList.push(deadline);
            }
          });
        });
        this.calendarOptions = {
          events: this.deadlineList,
        };
      }
    });
  }
}
