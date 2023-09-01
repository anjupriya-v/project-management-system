import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  filledNav: String = 'filled-nav';
  filledNavUserContentColor: string = 'filled-nav-user-content-color';
  currentProjectDetails: any[] = [];
  copyCurrentProjectDetails: any[] = [];
  completedProjectDetails: any[] = [];
  copyCompletedProjectDetails: any[] = [];
  sortAToZCur: any[] = [];
  sortZToACur: any[] = [];
  deadlineNearbyProjectsCur: any[] = [];
  deadlineEndedProjectsCur: any[] = [];
  sortAToZCom: any[] = [];
  sortZToACom: any[] = [];

  remainingTeamMembersCount: any;
  selectedFilterCur: any = 'defaultCur';
  selectedFilterCom: any = 'defaultCom';
  todayDate: number = Date.now();
  noDataCur: any = false;
  noDataCom: any = false;
  projectsLoader: boolean = false;
  constructor(
    protected auth: AuthService,
    protected projectService: ProjectService,
    private notification: NzNotificationService
  ) {}
  currentUser: any = JSON.parse(this.auth.getCurrentUser() || '{}');
  ngOnInit() {
    this.projectsLoader = true;
    this.getProjectDetails();
  }
  getDate(date: any): any {
    return new Date(date);
  }
  daysLeftFunc(deadline: any) {
    var today = new Date();
    var date_to_reply = new Date(deadline);
    var timeinmilisec = date_to_reply.getTime() - today.getTime();
    return Math.ceil(timeinmilisec / (500 * 60 * 60 * 24));
  }
  checkArrayValuesAvailability(projectDetails: any[], projectCond: any) {
    if (projectDetails.length == 0 && projectCond == 'cur') {
      this.noDataCur = true;
      return;
    }
    if (projectDetails.length == 0 && projectCond == 'com') {
      this.noDataCom = true;
      return;
    }
    this.noDataCur = false;
    this.noDataCom = false;
  }
  sortAToZ(projectDetails: any[]): any[] {
    return projectDetails.slice().sort(function (a: any, b: any): any {
      var nameA = a.projectTitle.toLowerCase(),
        nameB = b.projectTitle.toLowerCase();
      return nameA < nameB ? -1 : 1;
    });
  }
  sortZToA(projectDetails: any[]): any[] {
    return projectDetails.slice().sort(function (a: any, b: any) {
      var nameA = a.projectTitle.toLowerCase(),
        nameB = b.projectTitle.toLowerCase();
      return nameA > nameB ? -1 : 1;
    });
  }
  showDeadlineNearByProjects(projectDetails: any[]): any[] {
    return projectDetails.slice().sort(function (a: any, b: any) {
      var dateA: any = new Date(a.deadline);
      var dateB: any = new Date(b.deadline);
      return dateA - dateB;
    });
  }
  filterFunc(projectList: any[], value: any) {
    return Object.assign([], projectList).filter(
      (item: any) =>
        item['projectTitle'].toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  filterCurrentProjects(value: any) {
    this.selectedFilterCur = value;
    if (value == 'defaultCur') {
      this.currentProjectDetails = this.copyCurrentProjectDetails;
    } else {
      if (value == 'sortAToZCur') {
        this.sortAToZCur = this.sortAToZ(this.copyCurrentProjectDetails);
        this.currentProjectDetails = this.sortAToZCur;
      }
      if (value == 'sortZToACur') {
        this.sortZToACur = this.sortZToA(this.copyCurrentProjectDetails);
        console.log(this.sortZToACur);
        this.currentProjectDetails = this.sortZToACur;
      }
      if (value == 'deadlineNearbyProjectsCur') {
        this.deadlineNearbyProjectsCur = this.showDeadlineNearByProjects(
          this.copyCurrentProjectDetails
        );
        this.currentProjectDetails = this.deadlineNearbyProjectsCur;
      }
      if (value == 'deadlineEndedProjectsCur') {
        this.deadlineEndedProjectsCur = [];
        this.copyCurrentProjectDetails.forEach((element: any) => {
          if (this.daysLeftFunc(element.deadline) < 0) {
            this.deadlineEndedProjectsCur.push(Object.assign({}, element));
          }
        });
        this.currentProjectDetails = this.deadlineEndedProjectsCur;
      }
    }
    this.checkArrayValuesAvailability(this.currentProjectDetails, 'cur');
  }

  handleSearchCurrentProjects(value: any) {
    if (!value) {
      this.filterCurrentProjects(this.selectedFilterCur);
      this.noDataCur = false;
      return;
    } else {
      if (this.selectedFilterCur == 'deadlineEndedProjectsCur') {
        this.currentProjectDetails = this.filterFunc(
          this.deadlineEndedProjectsCur,
          value
        );
      } else if (this.selectedFilterCur == 'sortAToZCur') {
        this.currentProjectDetails = this.filterFunc(this.sortAToZCur, value);
      } else if (this.selectedFilterCur == 'sortZToACur') {
        this.currentProjectDetails = this.filterFunc(this.sortZToACur, value);
      } else if (this.selectedFilterCur == 'deadlineNearbyProjectsCur') {
        this.currentProjectDetails = this.filterFunc(
          this.deadlineNearbyProjectsCur,
          value
        );
      } else {
        this.currentProjectDetails = this.filterFunc(
          this.copyCurrentProjectDetails,
          value
        );
      }
    }

    this.checkArrayValuesAvailability(this.currentProjectDetails, 'cur');
  }

  filterCompletedProjects(value: any) {
    this.selectedFilterCom = value;
    if (value == 'defaultCom') {
      this.completedProjectDetails = this.copyCompletedProjectDetails;
    } else {
      if (value == 'sortAToZCom') {
        this.sortAToZCom = this.sortAToZ(this.copyCompletedProjectDetails);
        this.completedProjectDetails = this.sortAToZCom;
      }
      if (value == 'sortZtoACom') {
        this.sortZToACom = this.sortZToA(this.copyCompletedProjectDetails);
        this.completedProjectDetails = this.sortZToACom;
      }
    }
    this.checkArrayValuesAvailability(this.completedProjectDetails, 'com');
  }
  handleSearchCompletedProjects(value: any) {
    if (!value) {
      this.filterCompletedProjects(this.selectedFilterCom);
      this.noDataCom = false;
      return;
    } else {
      if (this.selectedFilterCom == 'sortAToZCom') {
        this.completedProjectDetails = this.filterFunc(this.sortAToZCom, value);
      } else if (this.selectedFilterCom == 'sortZToACom') {
        this.completedProjectDetails = this.filterFunc(this.sortZToACom, value);
      } else {
        this.completedProjectDetails = this.filterFunc(
          this.copyCompletedProjectDetails,
          value
        );
      }

      this.checkArrayValuesAvailability(this.completedProjectDetails, 'com');
    }
  }

  getProjectDetails() {
    this.projectService.getProjectDetails().subscribe((data: any) => {
      this.currentProjectDetails = [];
      this.completedProjectDetails = [];
      if (data.status) {
        this.projectsLoader = false;
        data.projectDetails.forEach((element: any) => {
          element.teamMembers.forEach((teamMember: any) => {
            if (teamMember.userName == this.currentUser['userName']) {
              if (element.status == 'Incomplete') {
                this.currentProjectDetails.push(Object.assign({}, element));
              } else {
                this.completedProjectDetails.push(Object.assign({}, element));
              }
            }
          });
        });
        this.copyCurrentProjectDetails = this.currentProjectDetails;
        this.copyCompletedProjectDetails = this.completedProjectDetails;
      }
    });
  }
  changeProjectStatus(projectId: any) {
    this.projectService
      .changeProjectStatus(projectId)
      .subscribe((data: any) => {
        if (data.status) {
          this.notification.success('Status', data.message, {
            nzPlacement: 'bottomRight',
          });
          this.getProjectDetails();
        } else {
          this.notification.error('Status', data.message, {
            nzPlacement: 'bottomRight',
          });
        }
      });
  }
  deleteProject(projectId: any, projectTitle: any) {
    this.projectService
      .deleteProject(projectId, projectTitle)
      .subscribe((data: any) => {
        if (data.status) {
          this.notification.success('Deletion', data.message, {
            nzPlacement: 'bottomRight',
          });
          this.getProjectDetails();
        } else {
          this.notification.error('Deletion', data.message, {
            nzPlacement: 'bottomRight',
          });
        }
      });
  }
}
