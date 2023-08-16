import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pass-key-system',
  templateUrl: './pass-key-system.component.html',
  styleUrls: ['./pass-key-system.component.css'],
})
export class PassKeySystemComponent {
  filledNav: String = 'filled-nav';
  filledNavUserContentColor: any = 'filled-nav-user-content-color';
  isReasonPopOverVisible: boolean = false;
  submitted: boolean = false;
  requiredForm!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.myForm();
  }
  myForm() {
    this.requiredForm = this.fb.group({
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
  submitPassKey(event: Event) {
    this.submitted = true;
    console.log(event);
  }
}
