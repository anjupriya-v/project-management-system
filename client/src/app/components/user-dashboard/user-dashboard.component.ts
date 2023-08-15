import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  filledNav: String = 'filled-nav';
  filledNavUserContentColor: any = 'filled-nav-user-content-color';
  public pieChart: any;
  public multiBarChart: any;
  public scatterChart: any;
  currentUser: any = JSON.parse(this.auth.getCurrentUser() || '{}');
  taskAssignedCount: any = 0;
  taskCompletedCount: any = 0;
  projectAssignedCount: any = 0;
  projectCompletedCount: any = 0;
  userDashboardLoader: boolean = true;
  todayDate: number = Date.now();
  currentTasks: any[] = [];
  currentProjects: any[] = [];
  completedProjects: any[] = [];
  userProgress: any = 'userProgress';
  ratingSum: any = 0;
  activeDays: any[] = [];
  contributionCount: any[] = [];
  overAllRating: any = 0;
  constructor(
    private projectService: ProjectService,
    private auth: AuthService
  ) {}
  ngOnInit() {
    this.getProjectDetails();
  }
  daysLeftFunc(deadline: any) {
    var today = new Date();
    var date_to_reply = new Date(deadline);
    var timeinmilisec = date_to_reply.getTime() - today.getTime();
    return Math.ceil(timeinmilisec / (500 * 60 * 60 * 24));
  }
  getPieChart() {
    Chart.register(...registerables);
    const canvas = <HTMLCanvasElement>document.getElementById('pieChart');
    const ctx: any = canvas.getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['task Assigned', 'task Completed'],
        datasets: [
          {
            label: 'Tasks',
            data: [this.taskAssignedCount, this.taskCompletedCount],
            backgroundColor: ['rgb(255, 205, 86)', 'rgb(124, 216, 124)'],
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
  getMultiBarChart() {
    Chart.register(...registerables);
    const canvas = <HTMLCanvasElement>document.getElementById('multiBarChart');
    const ctx: any = canvas.getContext('2d');
    this.multiBarChart = new Chart(ctx, {
      type: 'bar',

      data: {
        labels: ['Projects'],
        datasets: [
          {
            label: 'Projects Assigned',
            data: [this.projectAssignedCount],
            backgroundColor: '#1890ff',
          },
          {
            label: 'Projects Completed',
            data: [this.projectCompletedCount],
            backgroundColor: 'limegreen',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }
  getScatterChart() {
    Chart.register(...registerables);
    const canvas = <HTMLCanvasElement>document.getElementById('scatterChart');
    const ctx: any = canvas.getContext('2d');
    this.scatterChart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Contribution Count',
            data: this.contributionCount,
            backgroundColor: ['#6EC531'],
            borderColor: ['black'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            type: 'timeseries',
            time: {
              unit: 'day',
              tooltipFormat: 'DD MMM',
            },
            adapters: {
              date: {
                locale: enUS,
              },
            },
          },
        },
      },
    });
  }
  getDateFormat(date: any) {
    return (
      new Date(date).getFullYear() +
      '-' +
      (new Date(date).getMonth() + 1) +
      '-' +
      new Date(date).getDate()
    );
  }
  getProjectDetails() {
    this.projectService.getProjectDetails().subscribe((data: any) => {
      this.userDashboardLoader = false;
      if (data.status) {
        data.projectDetails.forEach((project: any, index: any) => {
          project.tasks.forEach((task: any) => {
            if (task.assignee == this.currentUser['userName']) {
              if (task.approvalStatus != 'Approved') {
                this.taskAssignedCount++;
                var currentTask = {
                  projectId: project._id,
                  projectTitle: project.projectTitle,
                  taskName: task.taskName,
                  deadline: task.deadline,
                  progressStatus: task.progressStatus,
                };
                this.currentTasks.push(currentTask);
              } else {
                this.taskCompletedCount++;
              }
            }
          });
          project.teamMembers.forEach((teamMember: any) => {
            if (
              teamMember.userName == this.currentUser['userName'] &&
              teamMember.rating == undefined
            ) {
              this.ratingSum += 0;
            }
            if (
              teamMember.userName == this.currentUser['userName'] &&
              teamMember.rating != undefined
            ) {
              this.ratingSum += teamMember.rating;
            }
            if (
              teamMember.userName == this.currentUser['userName'] &&
              project.status == 'Incomplete'
            ) {
              this.projectAssignedCount++;
              var role = '';
              var individualTaskAssignedCount = 0;
              project.tasks.forEach((task: any) => {
                if (task.assignee == this.currentUser['userName']) {
                  if (task.approvalStatus != 'Approved') {
                    individualTaskAssignedCount++;
                  }
                }
              });
              role =
                teamMember.role == 'Admin' || teamMember.role == 'Team Lead'
                  ? 'Team Leader'
                  : 'Team Member';
              var currentProject = {
                projectId: project._id,
                projectTitle: project.projectTitle,
                deadline: project.deadline,
                yourRole: role,
                taskCount: individualTaskAssignedCount,
              };
              this.currentProjects.push(currentProject);
            }
            if (
              teamMember.userName == this.currentUser['userName'] &&
              project.status == 'Completed'
            ) {
              this.projectCompletedCount++;
              var role = '';
              var individualTaskCompletedCount = 0;
              var rating = 0;
              project.tasks.forEach((task: any) => {
                if (task.assignee == this.currentUser['userName']) {
                  if (task.approvalStatus != 'Approved') {
                    individualTaskCompletedCount++;
                  }
                }
              });
              role =
                teamMember.role == 'Admin' || teamMember.role == 'Team Lead'
                  ? 'Team Leader'
                  : 'Team Member';
              rating = teamMember.rating == undefined ? 0 : teamMember.rating;
              var completedProject = {
                projectId: project._id,
                projectTitle: project.projectTitle,
                deadline: project.deadline,
                yourRole: role,
                userRating: rating,
                tasksDone: individualTaskCompletedCount,
              };
              this.completedProjects.push(completedProject);
            }
          });
          project.activeDays.forEach((activeDay: any) => {
            if (activeDay.userName == this.currentUser['userName']) {
              var day = this.getDateFormat(activeDay.timeStamp);
              if (!this.activeDays.includes(day.toString())) {
                this.activeDays.push(day);
              }
            }
          });
        });
        this.activeDays.forEach((activeDay) => {
          var count = 0;
          data.projectDetails.forEach((project: any) => {
            project.activeDays.forEach((active: any) => {
              if (
                this.getDateFormat(activeDay) ==
                this.getDateFormat(active.timeStamp)
              ) {
                count++;
              }
            });
          });
          var scatterPlotData = {
            x: new Date(activeDay),
            y: count,
          };
          this.contributionCount.push(scatterPlotData);
        });
        this.overAllRating = this.ratingSum / data.projectDetails.length;

        setTimeout(() => {
          this.getPieChart();
          this.getMultiBarChart();
          this.getScatterChart();
        }, 1000);
      }
    });
  }
}
