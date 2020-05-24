import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lead-create',
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.scss']
})
export class LeadCreateComponent implements OnInit {

  validateForm!: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }


  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  // customValidator(control: FormControl) {
  //   if (!control.value) {
  //     return { required: true };
  //   } else if (isNaN(control.value)) {
  //     return { amount: true, error: true };
  //   }
  //   return {};
  // }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+91'],
      phoneNumber: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      followUp: [null, [Validators.required]],
      agree: [false],
      status: ["NEW", [Validators.required]],
    });
  }
}
