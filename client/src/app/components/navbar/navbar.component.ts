import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isOpen: boolean = false;
  filledNavColor: String = '';
  filledNavUserContentColorChange: String = '';
  isProfileModalVisible: boolean = false;
  logOutLoader: boolean = false;
  currentUser: any = JSON.parse(this.auth.getCurrentUser());
  @Input() filledNav: String = '';
  @Input() filledNavUserContentColor = '';
  constructor(
    protected auth: AuthService,
    private route: Router,
    private notification: NzNotificationService
  ) {}
  ngInit() {}
  ngAfterViewInit() {
    this.filledNavColor = this.filledNav;
    this.filledNavUserContentColorChange = this.filledNavUserContentColor;
  }
  handleSideNav = () => {
    this.isOpen = !this.isOpen;
  };
  showProfileModal() {
    this.isProfileModalVisible = true;
  }
  handleCancelProfileModal() {
    this.isProfileModalVisible = false;
  }
  public logOut() {
    this.filledNav = 'filled-nav';
    this.filledNavUserContentColorChange = 'filled-nav-user-content-color';
    this.logOutLoader = true;
    setTimeout(() => {
      this.auth.handleLogout();
      this.route.navigate(['/login']);
      this.notification.success('Log Out', 'Logged Out Successfully!', {
        nzPlacement: 'bottomRight',
      });
    }, 3000);
  }
}
