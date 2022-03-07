import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GoogleLoginProvider, SocialAuthService } from "angularx-social-login";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "../authentication.service";
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { MatSnackBar } from "@angular/material/snack-bar";

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
    forgotPassword: "forgot",
  };
  buttonText: string = "Log in";
  nextAction: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private socialAuth: SocialAuthService,
    private googlePlus: GooglePlus,
    private router: Router,
    private snackBar: MatSnackBar
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

      case this.formView.forgotPassword:
        this.submitForgotPassword(username);
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

  submitForgotPassword(username: string) {
    this.authService.forgotPassword(username).subscribe(
      (data: any) => {
        this.snackBar.open("We have sent an email with instructions to reset your password", "cancel", {
          duration: 2000,
          verticalPosition: 'top'
        });

        this.formType = this.formView.login;
        this.fieldsToShow.confirmPassword = true;
        this.buttonText = "Login";
      },
      (error: Error) => {
        this.snackBar.open(error.message, "cancel", {
          duration: 2000,
          verticalPosition: 'top'
        });
        this.onFormTypeChange(this.formView.login);
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
    this.nextAction = this.formView.forgotPassword;
    this.validateForm = this.fb.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      remember: [true],
    });
  }

  onFormTypeChange(formType) {
    this.formType = formType || this.formType;
    Object.keys(this.fieldsToShow).forEach((key: string) => {
      this.fieldsToShow[key] = true;
    });
    switch (this.formType) {
      case this.formView.forgotPassword:
        this.buttonText = "Get reset link";
        this.fieldsToShow.confirmPassword = false;
        this.fieldsToShow.password = false;
        this.nextAction = this.formView.login;
        break;
      case this.formView.login:
        this.buttonText = "Log in";
        this.fieldsToShow.confirmPassword = false;
        this.nextAction = this.formView.login;
        break;
    }
  }



  googleLogin() {
    // check if the device is mobile or web
    if(environment.platform == 'web') {
      this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID);
    }else if(environment.platform == 'mobile') {
      this.googlePlus.login({})
        .then(res => console.log(res))
        .catch(err => console.error(err));
    }
  }
}
