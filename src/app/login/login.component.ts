import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

import {routePoints} from '../../menus/routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;
  formView = {
    login : "login",
    signup : "signup",
    reset : "reset"
  }
  buttonText: string = "Log in";
  nextAction: string;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private msg: NzMessageService,
    private router: Router
  ) { }

  formType = "login";
  fieldsToShow = {
    username: true,
    password: true,
    confirmPassword: false
  };

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const {username, password, confirmPassword} = this.validateForm.value;
    switch(this.formType) {
      case this.formView.login:
        this.submitLoginForm(username, password);
        break;
      case this.formView.signup:
        this.submitSignupForm(username, password, confirmPassword);
        break;

      case this.formView.reset:
        this.submitResetForm(username);
        break;
    }
  }


  submitLoginForm(username: string, password: string) {
    this.authService.login(username, password).subscribe((data: any)=>{
      this.msg.success("Successfully Logged In");
      this.router.navigate(["welcome", routePoints.LEADS_ALL]);
    }, (error: Error)=>{
      this.msg.error("Incorrect username or password");
    })
  }

  submitSignupForm(username, password, confirmPassword) {
    this.authService.signup(username, password, confirmPassword).subscribe((data: any)=>{
      this.msg.success("Your Account has been registered");
      this.router.navigate(["welcome", routePoints.LEADS_ALL]);
    }, (error: Error)=>{
      this.msg.error("Something went wrong");
    });
  }

  submitResetForm(username: string) {
    this.authService.resetPassword(username).subscribe((data: any)=>{
      this.msg.success("A link to reset your account has been sent to your email");
    }, (error: Error)=>{
      // message from the backend server to be shown here
      this.onFormTypeChange(this.formView.login);
      this.msg.error("Something went wrong");
    });
  }

  ngOnInit(): void {
    this.nextAction = this.formView.signup;
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      remember: [true]
    });
  }

  onFormTypeChange(formType) {
    this.formType = formType;
    Object.keys(this.fieldsToShow).forEach((key: string) => {
      this.fieldsToShow[key] = true;
    });
    switch(this.formType) {
      case this.formView.signup:
        this.buttonText = "register";
        this.fieldsToShow.confirmPassword = true;
        this.nextAction = this.formView.login;
        break;
      case this.formView.login:
        this.buttonText = "Log in";
        this.fieldsToShow.confirmPassword = false;
        this.nextAction = this.formView.signup;
        break;
      case this.formView.reset:
        this.fieldsToShow.password = false;
        this.fieldsToShow.confirmPassword = false;
        break;
    }
  }
}
