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
  userDashboardLoader: boolean = false;
  todayDate: number = Date.now();
  currentTasks: any[] = [];
  currentProjects: any[] = [];
  completedProjects: any[] = [];
  userProgress: any = 'userProgress';
  ratingSum: any = 0;
  ratingCount: any = 0;
  activeDays: any[] = [];
  contributionCount: any[] = [];
  overAllRating: any = 0;
  pieChartNotProcessed: boolean = false;
  multiBarChartNotProcessed: boolean = false;
  scatterChartNotProcessed: boolean = false;
  constructor(
    protected projectService: ProjectService,
    private auth: AuthService
  ) {}
  ngOnInit() {
    this.userDashboardLoader = true;
    this.getCurrentUserActiveDays();
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
        labels: ['Total tasks Assigned', 'Total tasks Completed'],
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
              this.ratingCount++;
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
        });
        this.activeDays.forEach((activeDay) => {
          var count = 0;
          data.projectDetails.forEach((project: any) => {
            project.activeDays.forEach((active: any) => {
              if (
                active.userName == this.currentUser['userName'] &&
                this.getDateFormat(activeDay) ==
                  this.getDateFormat(active.timeStamp)
              ) {
                count++;
              }
            });
          });
          console.log(count);
          var scatterPlotData = {
            x: new Date(activeDay),
            y: count,
          };
          this.contributionCount.push(scatterPlotData);
        });

        //calculating overall rating
        this.overAllRating = this.ratingSum / this.ratingCount;

        //pie chart
        if (this.taskAssignedCount != 0 || this.taskCompletedCount != 0) {
          this.pieChartNotProcessed = false;
          setTimeout(() => {
            this.getPieChart();
          }, 500);
        } else {
          this.pieChartNotProcessed = true;
        }
        //multibar chart
        if (this.projectAssignedCount != 0 || this.projectCompletedCount != 0) {
          this.multiBarChartNotProcessed = false;
          setTimeout(() => {
            this.getMultiBarChart();
          }, 500);
        } else {
          this.multiBarChartNotProcessed = true;
        }

        //scatter chart
        if (this.contributionCount.length != 0) {
          this.scatterChartNotProcessed = false;
          setTimeout(() => {
            this.getScatterChart();
          }, 500);
        } else {
          this.scatterChartNotProcessed = true;
        }
      }
    });
  }
  getCurrentUserActiveDays() {
    this.auth.getRegisteredUsers().subscribe((data: any) => {
      if (data.status) {
        data.registeredUsers.result.forEach((user: any) => {
          if (user.userName == this.currentUser['userName']) {
            user.activeDays.forEach((activeDay: any) => {
              var day = this.getDateFormat(activeDay.timeStamp);
              if (!this.activeDays.includes(day.toString())) {
                this.activeDays.push(day);
              }
            });
          }
        });
      }
    });
  }
}
