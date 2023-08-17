import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-pass-key-system',
  templateUrl: './pass-key-system.component.html',
  styleUrls: ['./pass-key-system.component.css'],
})
export class PassKeySystemComponent implements OnInit {
  filledNav: String = 'filled-nav';
  projectId: any = this.route.snapshot.paramMap.get('projectId');
  projectTitle: any = this.route.snapshot.paramMap.get('projectTitle');
  inActiveText: any = this.route.snapshot.paramMap.get('inActive');
  filledNavUserContentColor: any = 'filled-nav-user-content-color';
  isResetPassKeyDrawervisible: boolean = false;
  passKeyFormSubmitted: boolean = false;
  emailverificationFormSubmitted: boolean = false;
  verificationCodeSubmitted: boolean = false;
  resetPassKeySubmitted: boolean = false;
  requiredPassKeyForm!: FormGroup;
  requiredEmailVerificationForm!: FormGroup;
  requiredVerificationCodeForm!: FormGroup;
  requiredResetPassKeyForm!: FormGroup;
  showInput: boolean = false;
  currentUserRoleInProject: any;
  currentUser: any = JSON.parse(this.auth.getCurrentUser() || '{}');

  @ViewChild('emailVerification') emailVerification: any;
  @ViewChild('verificationCode') verificationCode: any;
  @ViewChild('emailVerify') emailVerify: any;
  @ViewChild('resetPassKey') resetPassKey: any;

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private messageService: NzMessageService
  ) {
    this.passKeyForm();
    this.emailVerificationForm();
    this.verificationCodeForm();
    this.resetPassKeyForm();
  }
  ngOnInit() {
    this.getCurrentUserRoleInProject();
  }
  passKeyForm() {
    this.requiredPassKeyForm = this.fb.group({
      passKey: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(13),
        ],
      ],
    });
  }
  emailVerificationForm() {
    this.requiredEmailVerificationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  verificationCodeForm() {
    this.requiredVerificationCodeForm = this.fb.group({
      code: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }
  resetPassKeyForm() {
    this.requiredResetPassKeyForm = this.fb.group({
      resetPassKey: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(13),
        ],
      ],
    });
  }
  openResetPassKeyDrawer(): void {
    this.isResetPassKeyDrawervisible = true;
  }

  closeResetPassKeyDrawer(): void {
    this.isResetPassKeyDrawervisible = false;
    this.requiredEmailVerificationForm.controls['email'].setValue('');
    this.requiredVerificationCodeForm.controls['code'].setValue('');
    this.requiredResetPassKeyForm.controls['resetPassKey'].setValue('');
  }
  submitPassKey(event: Event) {
    this.passKeyFormSubmitted = true;
    if (this.requiredPassKeyForm.valid) {
      var passKey = this.requiredPassKeyForm.controls['passKey'].value;
      this.projectService
        .authenticatePassKey(this.projectId, passKey)
        .subscribe((data: any) => {
          if (data.status) {
            this.projectService.storeProjectData(data.token, data.project);
            this.messageService.create('success', data.message);
            this.router.navigate([
              '/projects/project-dashboard',
              data.project.projectId,
            ]);
          } else {
            this.messageService.create('error', data.message);
          }
        });
    }
  }
  submitEmailForVerification(event: Event) {
    this.emailverificationFormSubmitted = true;
    if (this.requiredEmailVerificationForm.valid) {
      this.emailVerification.nativeElement.style.display = 'none';
      this.verificationCode.nativeElement.style.display = 'block';
    }
  }
  submitVerificationCode(event: any) {
    this.verificationCodeSubmitted = true;
    if (this.requiredVerificationCodeForm.valid) {
      this.emailVerify.nativeElement.style.display = 'none';
      this.resetPassKey.nativeElement.style.display = 'block';
    }
  }
  editEmailForResetPassKey() {
    this.emailVerification.nativeElement.style.display = 'block';
    this.verificationCode.nativeElement.style.display = 'none';
  }
  submitResetPassKey(event: any) {
    this.resetPassKeySubmitted = true;
    if (this.requiredResetPassKeyForm.valid) {
      this.requiredEmailVerificationForm.controls['email'].setValue('');
      this.requiredVerificationCodeForm.controls['code'].setValue('');
      this.requiredResetPassKeyForm.controls['resetPassKey'].setValue('');
      this.emailverificationFormSubmitted = false;
      this.verificationCodeSubmitted = false;
      this.resetPassKeySubmitted = false;
      this.isResetPassKeyDrawervisible = false;
    }
  }
  resendPassKey() {
    this.projectService
      .resendPassKey(this.projectId, this.currentUser['email'])
      .subscribe((data: any) => {
        if (data.status) {
          this.messageService.create('success', data.message);
        } else {
          this.messageService.create('error', data.message);
        }
      });
  }
  getCurrentUserRoleInProject() {
    this.projectService
      .getCurrentUserRoleInProject(this.projectId, this.currentUser['email'])
      .subscribe((data: any) => {
        if (data.status) {
          if (data.role == 'Admin' || data.role == 'Team Lead') {
            this.currentUserRoleInProject = 'Team Leader';
          } else {
            this.currentUserRoleInProject = 'Team Member';
          }
        }
      });
  }
  requestToResetPassKey() {
    this.projectService
      .requestToResetPassKey(this.projectId, this.currentUser['email'])
      .subscribe((data: any) => {
        if (data.status) {
          this.messageService.create('success', data.message);
        } else {
          this.messageService.create('error', data.message);
        }
      });
  }
}
