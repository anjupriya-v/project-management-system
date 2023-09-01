import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

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
  ratingCount: any = 0;
  ratingSum: any = 0;
  overAllRating: any = 0;
  currentUser: any = JSON.parse(this.auth.getCurrentUser());
  profileLoader: boolean = false;
  constructor(
    private auth: AuthService,
    private projectService: ProjectService
  ) {}
  ngOnInit() {
    this.fullName = this.currentUser['fullName'];
    this.userName = this.currentUser['userName'];
    this.role = this.currentUser['role'];
    this.profileImage = this.currentUser['profileImage'];
    this.email = this.currentUser['email'];
    this.phoneNumber = this.currentUser['phoneNumber'];
    this.profileLoader = true;
    this.getProjectDetails();
  }
  getProjectDetails() {
    this.projectService.getProjectDetails().subscribe((data: any) => {
      if (data.status) {
        this.profileLoader = false;
        data.projectDetails.forEach((project: any) => {
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
          });
          this.overAllRating = this.ratingSum / this.ratingCount;
        });
      }
    });
  }
}
