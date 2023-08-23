import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ProjectDashboardComponent } from './components/project-dashboard/project-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth-guard.service';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { LoggedInAuthGuard } from './guards/loggedIn-auth-guard.service';
import { RoleAuthGuard } from './guards/role-auth-guard.service';
import { CalendarComponent } from './components/calendar/calendar.component';
import { RegisteredUsersComponent } from './components/registered-users/registered-users.component';
import { ProjectForumsComponent } from './components/project-forums/project-forums.component';
import { PassKeySystemComponent } from './components/pass-key-system/pass-key-system.component';
import { ProjectGuard } from './guards/project-guard.service';

import { ScheduleMeetingComponent } from './components/schedule-meeting/schedule-meeting.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/create-project',
    component: CreateProjectComponent,
    canActivate: [RoleAuthGuard],
    data: {
      role: `${'Admin' || 'Team Lead'}`,
    },
  },
  {
    path: 'projects/project-dashboard/:projectId',
    component: ProjectDashboardComponent,
    canActivate: [ProjectGuard],
  },
  {
    path: 'projects/project-forums',
    component: ProjectForumsComponent,
    canActivate: [ProjectGuard],
  },
  {
    path: 'projects/project-dashboard/:projectId/schedule-meeting/:projectTitle',
    component: ScheduleMeetingComponent,
    canActivate: [ProjectGuard],
  },
  {
    path: 'registered-users',
    component: RegisteredUsersComponent,
    canActivate: [RoleAuthGuard],
    data: {
      role: 'Admin',
    },
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/auth/pass-key-system/:projectId/:projectTitle',
    component: PassKeySystemComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedInAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private route: Router) {}
}
