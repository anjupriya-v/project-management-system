import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
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
  currentUser: any = JSON.parse(this.auth.getCurrentUser());
  @Input() filledNav: String = '';
  @Input() filledNavUserContentColor = '';
  constructor(protected auth: AuthService, private route: Router) {}
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
    this.auth.handleLogout();

    this.route.navigate(['/login']);
  }
}
