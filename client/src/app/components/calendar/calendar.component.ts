import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';
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
  eventList: any[] = [];
  calendarLoader: boolean = false;
  calendarOptions: CalendarOptions = {};
  constructor(
    private projectService: ProjectService,
    private auth: AuthService
  ) {}
  ngOnInit() {
    this.calendarLoader = true;
    this.getProjectDetails();
  }

  daysLeftFunc(deadline: any) {
    var today = new Date();
    var date_to_reply = new Date(deadline);
    var timeinmilisec = date_to_reply.getTime() - today.getTime();
    return Math.ceil(timeinmilisec / (500 * 60 * 60 * 24));
  }
  convertTime(time: any) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? 'AM' : 'PM';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  }
  getProjectDetails() {
    this.projectService.getProjectDetails().subscribe((data: any) => {
      this.eventList = [];
      if (data.status) {
        this.calendarLoader = false;
        data.projectDetails.forEach((project: any) => {
          project.teamMembers.forEach((teamMember: any) => {
            if (teamMember.userName == this.currentUser['userName']) {
              if (
                project.status != 'Completed' &&
                this.daysLeftFunc(project.deadline) >= 0
              ) {
                var projectDeadline = {
                  className: 'fa fa-clock-o',
                  title: `${project.projectTitle}`,
                  backgroundColor: 'rgb(255, 106, 106)',
                  start: project.deadline,
                  url:
                    'http://localhost:4200/projects/project-dashboard/' +
                    project._id,
                };
                this.eventList.push(projectDeadline);
              }
              if (
                project.status != 'Completed' &&
                this.daysLeftFunc(project.deadline) < 0
              ) {
                var dealine = {
                  title: `${project.projectTitle}`,
                  start: project.deadline,
                  className: 'fa fa-clock-o',
                  backgroundColor: 'rgb(255, 170, 170)',
                  url:
                    'http://localhost:4200/projects/project-dashboard/' +
                    project._id,
                  textColor: 'black',
                };
                this.eventList.push(dealine);
              }
              project.meetings.forEach((meeting: any) => {
                var meetingObj = {};
                if (meeting.recurrence == 'Once') {
                  meetingObj = {
                    className: 'fa fa-video-camera',
                    title:
                      project.projectTitle +
                      ' - ' +
                      meeting.summary +
                      ' ( ' +
                      this.convertTime(meeting.startingTime) +
                      ' )',
                    backgroundColor: 'rgb(149, 81, 214)',
                    url: meeting.meetingLink,
                    start: meeting.startingDate,
                  };
                }
                if (meeting.recurrence == 'Daily') {
                  meetingObj = {
                    className: 'fa fa-video-camera',
                    title:
                      project.projectTitle +
                      ' - ' +
                      meeting.summary +
                      ' ( ' +
                      this.convertTime(meeting.startingTime) +
                      ' )',
                    backgroundColor: 'rgb(149, 81, 214)',
                    url: meeting.meetingLink,
                    rrule: {
                      freq: 'daily',
                      dtstart: meeting.startingDate,
                    },
                  };
                }
                if (meeting.recurrence == 'Weekly') {
                  meetingObj = {
                    className: 'fa fa-video-camera',
                    title:
                      project.projectTitle +
                      ' - ' +
                      meeting.summary +
                      ' ( ' +
                      this.convertTime(meeting.startingTime) +
                      ' )',
                    backgroundColor: 'rgb(149, 81, 214)',
                    url: meeting.meetingLink,
                    rrule: {
                      freq: 'weekly',
                      byweekday: [new Date(meeting.startingDate).getDay()],
                      dtstart: meeting.startingDate,
                    },
                  };
                }
                if (meeting.recurrence == 'Monthly') {
                  meetingObj = {
                    className: 'fa fa-video-camera',
                    title:
                      project.projectTitle +
                      ' - ' +
                      meeting.summary +
                      ' ( ' +
                      this.convertTime(meeting.startingTime) +
                      ' )',
                    backgroundColor: 'rgb(149, 81, 214)',
                    url: meeting.meetingLink,
                    rrule: {
                      freq: 'monthly',
                      dtstart: meeting.startingDate,
                    },
                  };
                }
                if (meeting.recurrence == 'Yearly') {
                  meetingObj = {
                    className: 'fa fa-video-camera',
                    title:
                      project.projectTitle +
                      ' - ' +
                      meeting.summary +
                      ' ( ' +
                      this.convertTime(meeting.startingTime) +
                      ' )',
                    backgroundColor: 'rgb(149, 81, 214)',
                    url: meeting.meetingLink,
                    rrule: {
                      freq: 'yearly',
                      dtstart: meeting.startingDate,
                    },
                  };
                }
                this.eventList.push(meetingObj);
                meetingObj = {};
              });
            }
          });
          project.tasks.forEach((task: any) => {
            if (task.assignee == this.currentUser['userName']) {
              if (
                task.approvalStatus != 'Approved' &&
                this.daysLeftFunc(task.deadline) >= 0
              ) {
                var taskDeadline = {
                  className: 'fa fa-check-square-o',
                  title: `${task.taskName}`,
                  start: task.deadline,
                  backgroundColor: 'rgb(255, 201, 99)',
                  url:
                    'http://localhost:4200/projects/project-dashboard/' +
                    project._id,
                };
                this.eventList.push(taskDeadline);
              }
              if (
                task.approvalStatus != 'Approved' &&
                this.daysLeftFunc(task.deadline) < 0
              ) {
                var deadline = {
                  className: 'fa fa-check-square-o',
                  title: `${task.taskName}`,
                  start: task.deadline,
                  backgroundColor: 'rgb(254, 232, 190)',
                  textColor: 'black',
                  url:
                    'http://localhost:4200/projects/project-dashboard/' +
                    project._id,
                };
                this.eventList.push(deadline);
              }
            }
          });
        });
        this.calendarOptions = {
          plugins: [rrulePlugin, dayGridPlugin],
          initialView: 'dayGridMonth',
          height: 600,
          events: this.eventList,
          eventClick: (event: any): any => {
            event.jsEvent.preventDefault();
            window.open(event.event.url, '_blank');
            return false;
          },
        };
      }
    });
  }
}
