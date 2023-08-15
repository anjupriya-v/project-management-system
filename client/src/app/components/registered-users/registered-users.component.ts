import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.css'],
})
export class RegisteredUsersComponent implements OnInit {
  filledNav: String = 'filled-nav';
  filledNavUserContentColor: string = 'filled-nav-user-content-color';
  registeredUsers: any[] = [];
  copyRegisteredUsers: any[] = [];
  adminArray: any[] = [];
  teamLeadArray: any[] = [];
  employeeArray: any[] = [];
  userRole: String = 'Default';
  fetchUsersMsg: any;
  fetchUsersStatus: any;
  searchNoData: boolean = false;
  isVisible = false;
  requiredForm!: FormGroup;
  submitted: boolean = false;
  registerStatus: boolean = true;
  registerMsg: any;
  userNameStatus: any = null;
  userNameStatusMsg: any = null;
  userNameLoader: boolean = false;
  deleteText: any = 'Delete';
  deleteEmail: any = null;
  disableAdminRole: boolean = false;
  formFunctionality: any = null;
  editingUserEmail: any = null;
  userProfileImageMsg: any = null;
  imageFile: any = null;
  newImageUpdate: any = false;
  profileImageLink: any =
    'https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg';
  userProfileImageSrc: any = this.profileImageLink;
  showPassword: boolean = false;
  updateUserSubscription!: Subscription;
  getRegisteredUsersSubscription!: Subscription;

  @ViewChild('selectInput', { static: false })
  selectInput!: ElementRef;
  @ViewChild('selectRoleDropdown', { static: false })
  selectRoleDropdown!: ElementRef;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {
    this.myForm();
  }
  ngOnInit(): void {
    this.getRegisteredUsers();
  }
  ngOnDestroy(): void {
    if (this.updateUserSubscription) {
      this.updateUserSubscription.unsubscribe();
    }
    if (this.getRegisteredUsersSubscription) {
      this.getRegisteredUsersSubscription.unsubscribe();
    }
  }
  myForm() {
    this.requiredForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z][A-Za-z0-9_]{3,14}$/),
        ],
      ],
      role: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
          ),
        ],
      ],
    });
  }
  showCreateModel(functionality: any): void {
    this.isVisible = true;
    this.formFunctionality = functionality;
    this.disableAdminRole = false;
    this.requiredForm.controls['email'].enable();
    this.requiredForm.controls['userName'].enable();
    this.requiredForm.controls['fullName'].setValue('');
    this.requiredForm.controls['userName'].setValue('');
    this.requiredForm.controls['role'].setValue('');
    this.requiredForm.controls['email'].setValue('');
    this.requiredForm.controls['phoneNumber'].setValue('');
    this.requiredForm.controls['password'].setValue('');
    this.userProfileImageSrc = this.profileImageLink;
    this.userProfileImageMsg = null;
  }
  showUpdateModel(email: any, functionality: any): void {
    this.editingUserEmail = email;
    this.formFunctionality = functionality;
    this.isVisible = true;
    this.disableAdminRole = true;
    this.requiredForm.controls['email'].disable();
    this.requiredForm.controls['userName'].disable();

    this.auth.fetchUserInfoForEdit(email).subscribe((data: any) => {
      if (data.status) {
        this.requiredForm.controls['fullName'].setValue(
          data.user.user['fullName']
        );
        this.requiredForm.controls['userName'].setValue(
          data.user.user['userName']
        );
        this.requiredForm.controls['role'].setValue(data.user.user['role']);
        this.requiredForm.controls['email'].setValue(data.user.user['email']);
        this.requiredForm.controls['phoneNumber'].setValue(
          data.user.user['phoneNumber']
        );
        this.requiredForm.controls['password'].setValue(
          data.user.user['password']
        );
        this.userProfileImageSrc = data.user.user['profileImage'];
        this.imageFile = data.user.user['profileImage'];
      }
    });
  }
  handleCancel(): void {
    this.submitted = false;
    this.userNameStatus = null;
    this.registerStatus = true;
    this.isVisible = false;
    this.requiredForm.controls['fullName'].setValue('');
    this.requiredForm.controls['userName'].setValue('');
    this.requiredForm.controls['role'].setValue('');
    this.requiredForm.controls['email'].setValue('');
    this.requiredForm.controls['phoneNumber'].setValue('');
    this.requiredForm.controls['password'].setValue('');
    this.userProfileImageSrc = this.profileImageLink;
    this.userProfileImageMsg = null;
  }

  uploadProfileImage = (event: Event) => {
    this.newImageUpdate = true;
    const target = event.target as HTMLInputElement;
    this.imageFile = (target.files as FileList)[0];
    if (!this.imageFile || this.imageFile.length == 0) {
      this.userProfileImageMsg = 'You must select an image';
      return;
    }
    var mimeType = this.imageFile.type;
    if (mimeType.match(/image\/*/) == null) {
      this.userProfileImageMsg = 'Only images are supported';
      return;
    }

    var reader = new FileReader();
    reader.onload = () => {
      this.userProfileImageMsg = null;
      this.userProfileImageSrc = reader.result as String;
    };
    reader.readAsDataURL(this.imageFile);
  };
  handleSelectRole = () => {
    this.selectRoleDropdown.nativeElement.classList.toggle('active');
  };
  showSelectValue = (value: any) => {
    this.selectInput.nativeElement.value = value;
    this.requiredForm.controls['role'].setValue(value);
  };
  checkUserName(value: any) {
    this.userNameLoader = true;
    this.userNameStatus = null;
    this.auth.checkUserName(value).subscribe((data: any) => {
      this.userNameStatus = data.checkUserStatus;
      this.userNameStatusMsg = data.message;
      this.userNameLoader = false;
    });
  }
  getUrlExtension = (url: any) => {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  };
  handleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  createUser = async (event: Event) => {
    this.submitted = true;
    this.deleteText = 'Delete';
    this.deleteEmail = null;
    if (this.imageFile == null) {
      if (this.imageFile) {
        var imgExt = this.getUrlExtension(this.profileImageLink);
      }
      const response = await fetch(this.profileImageLink);
      const blob = await response.blob();
      this.imageFile = new File([blob], 'profileImage.' + imgExt, {
        type: blob.type,
      });
    }
    if (this.requiredForm.valid && this.userNameStatus == 'valid') {
      this.formFunctionality = 'Creating User...';
      this.auth
        .handleRegister(this.requiredForm.value, this.imageFile)
        .subscribe((data: any) => {
          if (data.status) {
            this.registerStatus = data.status;
            this.requiredForm.controls['fullName'].setValue('');
            this.requiredForm.controls['userName'].setValue('');
            this.requiredForm.controls['role'].setValue('');
            this.requiredForm.controls['email'].setValue('');
            this.requiredForm.controls['phoneNumber'].setValue('');
            this.requiredForm.controls['password'].setValue('');
            this.userProfileImageSrc = this.profileImageLink;
            this.userProfileImageMsg = null;
            this.userNameStatus = null;
            this.isVisible = false;
            this.submitted = false;
            this.notification.success('Creation', data.message, {
              nzPlacement: 'bottomRight',
            });
            this.getRegisteredUsers();
          } else {
            this.registerStatus = data.status;
            this.registerMsg = data.message;
            this.notification.error('Creation', data.message, {
              nzPlacement: 'bottomRight',
            });
            this.formFunctionality = 'Create User';
          }
        });
    }
  };
  updateUser = async (event: Event) => {
    this.submitted = true;
    if (!this.newImageUpdate) {
      if (this.imageFile) {
        var imgExt = this.getUrlExtension(this.imageFile);
      }

      const response = await fetch(this.imageFile);
      const blob = await response.blob();
      this.imageFile = new File([blob], 'profileImage.' + imgExt, {
        type: blob.type,
      });
    }
    if (this.requiredForm.valid) {
      this.formFunctionality = 'Updating User...';
      this.updateUserSubscription = this.auth
        .updateUser(
          this.requiredForm.value,
          this.editingUserEmail,
          this.imageFile
        )
        .subscribe((data: any) => {
          if (data.status) {
            this.notification.success('Updation', data.message, {
              nzPlacement: 'bottomRight',
            });
            this.isVisible = false;
            this.newImageUpdate = false;
            this.submitted = false;
            this.getRegisteredUsers();
          } else {
            this.notification.error('Updation', data.message, {
              nzPlacement: 'bottomRight',
            });
            this.formFunctionality = 'Update User';
          }
        });
    }
  };
  getRegisteredUsers() {
    this.getRegisteredUsersSubscription = this.auth
      .getRegisteredUsers()
      .subscribe((data: any) => {
        if (data.status) {
          this.copyRegisteredUsers = [];
          data.registeredUsers.result.forEach((element: any) => {
            this.copyRegisteredUsers.push(Object.assign({}, element));
          });
          if (this.userRole == 'Default') {
            this.registeredUsers = this.copyRegisteredUsers;
          } else {
            this.filterRegisteredUsers(this.userRole);
          }
        }
        this.fetchUsersMsg = data.message;
        this.fetchUsersStatus = data.status;
      });
  }
  searchBasedOnRole(listBasedOnRole: any[], value: any) {
    this.registeredUsers = Object.assign([], listBasedOnRole)
      .filter(
        (item: any) =>
          item['role'].toLowerCase().indexOf(this.userRole.toLowerCase()) > -1
      )
      .filter(
        (item: any) =>
          item['fullName'].toLowerCase().indexOf(value.toLowerCase()) > -1
      );
  }
  searchRegisteredUsers(value: any) {
    if (!value) {
      this.filterRegisteredUsers(this.userRole);
      this.searchNoData = false;
      return;
    } else if (this.userRole == 'Default') {
      this.registeredUsers = Object.assign([], this.copyRegisteredUsers).filter(
        (item: any) =>
          item['fullName'].toLowerCase().indexOf(value.toLowerCase()) > -1
      );
    } else {
      if (this.userRole == 'Admin') {
        this.searchBasedOnRole(this.adminArray, value);
      }
      if (this.userRole == 'Team Lead') {
        this.searchBasedOnRole(this.teamLeadArray, value);
      }
      if (this.userRole == 'Employee') {
        this.searchBasedOnRole(this.employeeArray, value);
      }
    }

    if (this.registeredUsers.length == 0) {
      this.searchNoData = true;
    } else {
      this.searchNoData = false;
    }
  }
  filterFunc(role: any): any {
    var arr = Object.assign([], this.copyRegisteredUsers).filter(
      (item: any) => {
        return item['role'].toLowerCase().indexOf(role.toLowerCase()) > -1;
      }
    );
    return arr;
  }
  filterRegisteredUsers(role: String) {
    this.userRole = role;
    switch (this.userRole) {
      case 'Admin':
        this.adminArray = this.filterFunc(this.userRole);
        this.registeredUsers = this.adminArray;
        break;
      case 'Team Lead':
        this.teamLeadArray = this.filterFunc(this.userRole);
        this.registeredUsers = this.teamLeadArray;
        break;
      case 'Employee':
        this.employeeArray = this.filterFunc(this.userRole);
        this.registeredUsers = this.employeeArray;
        break;
      default:
        this.registeredUsers = this.copyRegisteredUsers;
        break;
    }
  }
  deleteUser(email: any) {
    this.deleteEmail = email;
    this.deleteText = 'Deleting...';
    this.auth.deleteUser(email).subscribe((data: any) => {
      if (data.status) {
        this.notification.error('Deletion', data.message, {
          nzPlacement: 'bottomRight',
        });
        this.getRegisteredUsers();
      } else {
        this.notification.error('Deletion', data.message, {
          nzPlacement: 'bottomRight',
        });
        this.deleteText = 'Delete';
      }
    });
  }
}
