import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  filledNav: String = 'filled-nav';
  submitted: boolean = false;
  loginMsg: string = '';
  loginStatus: any = null;
  requiredForm!: FormGroup;
  redirectURL: any;
  isLoggingIn: boolean = false;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService
  ) {
    this.myForm();
  }
  myForm() {
    this.requiredForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
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
  submitLoginForm(e: Event) {
    this.submitted = true;
    if (this.requiredForm.valid) {
      this.isLoggingIn = true;
      this.auth.handleLogin(this.requiredForm.value).subscribe((data: any) => {
        if (data.status == true) {
          this.auth.storeUserData(data.token, data.user);
          let params = this.route.snapshot.queryParams;
          if (params['redirectURL']) {
            this.redirectURL = params['redirectURL'];
          }

          if (this.redirectURL) {
            this.router
              .navigateByUrl(this.redirectURL)
              .catch(() => this.router.navigate(['/']));
          } else {
            this.router.navigate(['/']);
          }
          this.notification.success('Logged In', data.message, {
            nzPlacement: 'bottomRight',
          });
          this.isLoggingIn = false;
        } else {
          this.loginMsg = data.message;
          this.loginStatus = data.status;
          this.isLoggingIn = true;
        }
      });
    } else {
      console.log('invalid');
    }
  }
}
