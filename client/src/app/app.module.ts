import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ProjectsComponent } from './components/projects/projects.component';
import { HttpClientModule } from '@angular/common/http';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {
  CaretLeftOutline,
  SettingOutline,
  StepBackwardOutline,
} from '@ant-design/icons-angular/icons';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { ProjectDashboardComponent } from './components/project-dashboard/project-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AuthGuard } from './guards/auth-guard.service';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { LoggedInAuthGuard } from './guards/loggedIn-auth-guard.service';
import { RoleAuthGuard } from './guards/role-auth-guard.service';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisteredUsersComponent } from './components/registered-users/registered-users.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { registerLocaleData } from '@angular/common';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { TcRatingModule } from '@ngx-tc/rating';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import en from '@angular/common/locales/en';

registerLocaleData(en);
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { ProjectForumsComponent } from './components/project-forums/project-forums.component';
import { CreateProjectForumPostComponent } from './components/create-project-forum-post/create-project-forum-post.component';
import { HighlightedDatesComponent } from './components/highlighted-dates/highlighted-dates.component';
import { PassKeySystemComponent } from './components/pass-key-system/pass-key-system.component';
import { ProjectGuard } from './guards/project-guard.service';
import { BnNgIdleService } from 'bn-ng-idle';
const icons = [StepBackwardOutline, CaretLeftOutline, SettingOutline];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProjectsComponent,
    CreateProjectComponent,
    CreateTaskComponent,
    ProjectDashboardComponent,
    LoginComponent,
    UserDashboardComponent,
    CalendarComponent,
    ProfileComponent,
    RegisteredUsersComponent,
    ProjectForumsComponent,
    CreateProjectForumPostComponent,
    HighlightedDatesComponent,
    PassKeySystemComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NzCarouselModule,
    NzRadioModule,
    FormsModule,
    NzButtonModule,
    NzIconModule.forChild(icons),
    NzBreadCrumbModule,
    NzDividerModule,
    NzGridModule,
    NzCardModule,
    NzDropDownModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzAlertModule,
    NzModalModule,
    NzNotificationModule,
    NzToolTipModule,
    NzEmptyModule,
    NzTagModule,
    NzDrawerModule,
    NzProgressModule,
    NzRateModule,
    NzCalendarModule,
    TcRatingModule,
    NzMessageModule,
    NzPopconfirmModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NzPopoverModule,
    FullCalendarModule,
    NgApexchartsModule,
  ],
  providers: [
    AuthGuard,
    LoggedInAuthGuard,
    RoleAuthGuard,
    ProjectGuard,
    BnNgIdleService,
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
