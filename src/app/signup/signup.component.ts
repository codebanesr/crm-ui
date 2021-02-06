import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { AuthenticationService } from "src/authentication.service";
import { User } from "../home/interfaces/user";
import { UsersService } from "../home/users.service";
import { PubsubService } from "../pubsub.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  rolesOptions: any;
  loading = false;
  submitForm(): void {
    for (const i in this.signupForm.controls) {
      this.signupForm.controls[i].markAsDirty();
      this.signupForm.controls[i].updateValueAndValidity();
    }

    if (this.userid) {
      this.usersService
        .updateUser(this.userid, this.signupForm.value)
        .subscribe(
          (data: any) => {
            this._snackBar.open("Profile updated for ", this.signupForm.get('fullName').value, {duration: 2000, politeness: 'assertive'});
          },
          (error) => {
            this._snackBar.open("Failed to update user", error);
          }
        );
    } else {
      this.authService.signup(this.signupForm.value).subscribe(
        (data: any) => {
          this._snackBar.open("Your Account has been registered");
          this.router.navigate(["home"]);
        },
        (e: any) => {
          this._snackBar.open(e.error.message[0]);
        }
      );
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.signupForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signupForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private pubsub: PubsubService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.pubsub.$pub("HEADING", { heading: "Add User" });
    this.signupForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      fullName: [null, [Validators.required]],
      phoneNumberPrefix: ["+91"],
      phoneNumber: [null, [Validators.required]],
      roleType: [null, Validators.required],
      // manages: [[], Validators.required],
      roles: [[], Validators.required],
      reportsTo: [null],
      agree: [false],
    });

    this.createOrUpdate();

    this.rolesOptions = [
      {
        label: "Admin",
        value: "admin",
      },
      {
        label: "User",
        value: "user",
      },
    ];
  }

  userid: string;
  createOrUpdate() {
    this.userid = this.activatedRoute.snapshot.queryParams.userid;
    if(this.userid) {
      this.userid && this.usersService.getUserById(this.userid).subscribe((data: User) => {
        this.signupForm.patchValue(data);
        this.initUsersList(data.email);
      });
    } else {
      this.initUsersList();
    }
  }

  listOfSuperiors: User[] = [];
  listOfSelectedValue: string[] = [];

  // isNotSelected(value: string): boolean {
  //   // return this.listOfSelectedValue.indexOf(value) === -1;
  //   return this.signupForm.get("manages").value.indexOf(value) === -1;
  // }

  isNotSelectedRole(value): boolean {
    return this.signupForm.get("roles").value.indexOf(value) === -1;
  }

  usersCount = 0;
  initUsersList(userEmail?: string) {
    this.loading = true;
    this.usersService.getAllManagers(userEmail).subscribe(
      (users: User[]) => {
        this.listOfSuperiors = users;
      },
      (error) => {
        console.log(error);
      }, () => {
        this.loading = false;
      }
    );
  }
}
