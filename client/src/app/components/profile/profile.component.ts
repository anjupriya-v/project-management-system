import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication-service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  fullName: any;
  userName: any;
  role: any;
  profileImage: any;
  email: any;
  phoneNumber: any;

  currentUser: any = JSON.parse(this.auth.getCurrentUser());
  constructor(private auth: AuthService) {}
  ngOnInit() {
    this.fullName = this.currentUser['fullName'];
    this.userName = this.currentUser['userName'];
    this.role = this.currentUser['role'];
    this.profileImage = this.currentUser['profileImage'];
    this.email = this.currentUser['email'];
    this.phoneNumber = this.currentUser['phoneNumber'];
  }
}
