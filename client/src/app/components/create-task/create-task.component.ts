import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
})
export class CreateTaskComponent implements OnInit {
  requiredForm!: FormGroup;
  submitted: boolean = false;
  teamMembers: any[] = [];
  deadline: any;
  btnLoading: boolean = false;
  @Input() projectId = '';
  @Output() taskCreationCompleted = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private notification: NzNotificationService
  ) {
    this.myForm();
  }
  ngOnInit() {
    this.projectService.getProjectDetails().subscribe((data: any) => {
      if (data.status) {
        data.projectDetails.forEach((project: any) => {
          if (project._id == this.projectId) {
            this.teamMembers = project.teamMembers;
            this.deadline = project.deadline;
          }
        });
      }
    });
  }
  myForm() {
    this.requiredForm = this.fb.group({
      taskName: ['', Validators.required],
      assignee: ['', Validators.required],
      deadline: ['', Validators.required],
      priority: ['', Validators.required],
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
  submitTaskDetails = (event: Event) => {
    this.submitted = true;
    if (this.requiredForm.valid) {
      this.btnLoading = true;
      this.projectService
        .createTask(this.requiredForm.value, this.projectId)
        .subscribe((data: any) => {
          if (data.status) {
            this.taskCreationCompleted.emit(false);
            this.btnLoading = false;
            this.notification.success('Assign Task', data.message, {
              nzPlacement: 'bottomRight',
            });
          } else {
            this.btnLoading = false;
            this.notification.error('Assign Task', data.message, {
              nzPlacement: 'bottomRight',
            });
          }
        });
    } else {
      console.log('invalid');
    }
  };
}
