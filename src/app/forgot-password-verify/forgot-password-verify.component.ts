import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormControl,
  ValidationErrors,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-forgot-password-verify',
  templateUrl: './forgot-password-verify.component.html',
  styleUrls: ['./forgot-password-verify.component.scss'],
})
export class ForgotPasswordVerifyComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.onParamChange();
    this.initForm();
  }

  initForm() {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
    });
  }

  onParamChange() {
    const { token } = this.activatedRoute.snapshot.queryParams;
    this.authService.verifyToken(token).subscribe(
      (data: any) => {
        const { email } = data;
        this.validateForm.patchValue({ email });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  validateForm: FormGroup;

  submitForm({ email, password, confirm }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.authService.resetPassword({ email, password }).subscribe(
      (res) => {},
      (error) => {
        console.log(error);
      }
    );
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() =>
      this.validateForm.controls.confirm.updateValueAndValidity()
    );
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
}
