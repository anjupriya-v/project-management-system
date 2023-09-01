import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
})
export class CreateProjectComponent implements OnInit {
  filledNav: String = 'filled-nav';
  filledNavUserContentColor: string = 'filled-nav-user-content-color';
  value: string[] = [];
  submitted: boolean = false;
  requiredForm!: FormGroup;
  listOfSelectedUserNames: any = [];
  listOfUserNames: any = [];
  currentUser: any = JSON.parse(this.auth.getCurrentUser());
  submissionInProgress: boolean = false;
  createProjectLoader: boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private projectService: ProjectService,
    private notification: NzNotificationService,
    private router: Router
  ) {
    this.myForm();
  }
  ngOnInit(): void {
    this.createProjectLoader = true;
    this.fetchUserNames();
  }

  myForm() {
    this.requiredForm = this.fb.group({
      projectTitle: ['', [Validators.required, Validators.maxLength(20)]],
      projectDescription: ['', [Validators.required, Validators.minLength(80)]],
      deadline: ['', Validators.required],
      teamMembers: ['', Validators.required],
      confirmation: ['', Validators.required],
      passKey: [''],
    });
  }
  fetchUserNames() {
    this.auth.fetchUserNames().subscribe((data) => {
      if (data.status) {
        this.createProjectLoader = false;
        data.userNames.result.forEach((element: any) => {
          return this.listOfUserNames.push(element['userName']);
        });
      }
    });
  }
  getTodaysDate() {
    var today: any = new Date();
    var dd: any = today.getDate();
    var mm: any = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    return yyyy + '-' + mm + '-' + dd;
  }
  getAutomaticPassKey(): String {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_@#$%^&*_?';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 13) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  submitProjectDetailsForm(e: Event) {
    this.submitted = true;

    if (this.requiredForm.valid) {
      this.submissionInProgress = true;
      this.requiredForm.controls['teamMembers']?.setValue([
        ...this.requiredForm.controls['teamMembers']?.value,
        this.currentUser['userName'],
      ]);
      this.projectService
        .handleProjectCreation(this.requiredForm.value)
        .subscribe((data: any) => {
          console.log(data);
          if (data.status) {
            this.notification.success('Creation', data.message, {
              nzPlacement: 'bottomRight',
            });
            this.router.navigate(['/projects']);
            this.submissionInProgress = false;
          } else {
            this.notification.error('Creation', data.message, {
              nzPlacement: 'bottomRight',
            });
            this.submissionInProgress = false;
          }
        });
    } else {
      console.log('invalid');
    }
  }

  handleNoToGeneratePK() {
    this.requiredForm.controls['passKey']?.setErrors(null);
    this.requiredForm.controls['passKey']?.setValue('');
    (document.querySelector('.pass-key-div') as HTMLElement).style.display =
      'block';
    this.requiredForm
      .get('passKey')
      ?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(13),
      ]);
    this.requiredForm.get('passKey')?.updateValueAndValidity();
  }
  handleYesToGeneratePK() {
    this.requiredForm.controls['passKey']?.setErrors(null);

    (document.querySelector('.pass-key-div') as HTMLElement).style.display =
      'none';
    this.requiredForm.controls['passKey']?.clearValidators();
    this.requiredForm.get('passKey')?.updateValueAndValidity();
    var automaticPassKey = this.getAutomaticPassKey();
    this.requiredForm.controls['passKey']?.setValue(automaticPassKey);
  }
}
