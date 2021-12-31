import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GoogleLoginProvider, SocialAuthService } from "angularx-social-login";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  hide = true;
  validateForm: FormGroup;
  formView = {
    login: "login",
    signup: "signup",
    reset: "reset",
  };
  buttonText: string = "Log in";
  nextAction: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private socialAuth: SocialAuthService,
    // private toast: ToastService,
    private router: Router
  ) {
    if(authService.currentUserValue) {
      this.router.navigate(['home']);
    }
  }

  formType = "login";
  fieldsToShow = {
    username: true,
    password: true,
    confirmPassword: false,
  };

  
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const { username, password, confirmPassword } = this.validateForm.value;
    switch (this.formType) {
      case this.formView.login:
        this.submitLoginForm(username, password);
        break;

      case this.formView.reset:
        this.submitResetForm(username);
        break;
    }
  }

  submitLoginForm(username: string, password: string) {
    this.authService.login(username, password).subscribe(
      (data: any) => {
        // this.msg.success("Successfully Logged In");
        // this.toast.success("Login Successful");
        const currentUser = localStorage.getItem("currentUser");
        const currentUserObj = JSON.parse(currentUser);
        if (["admin", "manager"].includes(currentUserObj.roleType)) {
          this.router.navigate(["home"]);
        } else if (currentUserObj.roleType === "fieldExecutive") {
          this.router.navigate(["home", "followup"]);
        } else {
          this.router.navigate(["home", "campaign", "list"]);
        }
      },
      (error: Error) => {
        // this.toast.fail("Login failed");
      }
    );
  }

  submitResetForm(username: string) {
    this.authService.forgotPassword(username).subscribe(
      (data: any) => {
        // this.toast.success(
        //   "A link to reset your account has been sent to your email"
        // );
      },
      (error: Error) => {
        // message from the backend server to be shown here
        this.onFormTypeChange(this.formView.login);
        // this.toast.fail("Something went wrong");
      }
    );
  }


  user: any;
  loggedIn: any;
  ngOnInit(): void {
    this.socialAuth.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      if(this.loggedIn && !!localStorage.getItem('currentUser')) {
        this.router.navigate(['home']);
      } else {
        this.authService.loginWithSocialAuthToken({email: user.email, idToken: user.idToken, provider: user.provider}).subscribe(data => {
          this.router.navigate(['home']);
        })
      }
    });
    this.nextAction = this.formView.signup;
    this.validateForm = this.fb.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      remember: [true],
    });
  }

  onFormTypeChange(formType) {
    this.formType = formType;
    Object.keys(this.fieldsToShow).forEach((key: string) => {
      this.fieldsToShow[key] = true;
    });
    switch (this.formType) {
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



  googleLogin() {
    this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
