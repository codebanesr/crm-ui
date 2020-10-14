import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from 'src/authentication.service';
import { UsersService } from '../home/users.service';
import { PubsubService } from '../pubsub.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  rolesOptions: any;
  submitForm(): void {
    for (const i in this.signupForm.controls) {
      this.signupForm.controls[i].markAsDirty();
      this.signupForm.controls[i].updateValueAndValidity();
    }

    if(this.userid) {
      this.usersService.updateUser(this.userid, this.signupForm.value).subscribe(success=>{

      }, error=>{
        this.msg.error("Failed to update user", error);
      })
    }else{
      this.authService.signup(this.signupForm.value).subscribe((data: any)=>{
        this.msg.success("Your Account has been registered");
        this.router.navigate(["welcome", 'leads', 'all']);
      }, (e: any)=>{
        this.msg.error(e.error.message[0]);
      });
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
    private msg: NzMessageService,
    private router: Router,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private pubsub: PubsubService
  ) {}

  ngOnInit(): void {
    this.pubsub.$pub("HEADING", {heading: "Add User"});
    this.signupForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      fullName: [null, [Validators.required]],
      phoneNumberPrefix: ['+91'],
      phoneNumber: [null, [Validators.required]],
      roleType: [null, Validators.required],
      manages: [[], Validators.required],
      roles: [[], Validators.required],
      reportsTo: [null, Validators.required],
      agree: [false],
    });
    this.initUsersList();

    this.createOrUpdate();

    this.rolesOptions = [{
      label: "Admin",
      value: "admin"
    }, {
      label: "User",
      value: "user"
    }]
  }

  userid: string;
  createOrUpdate() {
    this.activatedRoute.queryParams.subscribe(data=>{
      this.userid = data.userid;
      this.usersService.getUserById(this.userid).subscribe(data=>{
        this.signupForm.patchValue(data);
      });

    }, error=>{
      this.msg.error("This was not supposed to happen");
    })
  }


  listOfOption = [];
  listOfSelectedValue: string[] = [];

  isNotSelected(value: string): boolean {
    // return this.listOfSelectedValue.indexOf(value) === -1;
    return this.signupForm.get('manages').value.indexOf(value) === -1
  }


  isNotSelectedRole(value): boolean {
    return this.signupForm.get('roles').value.indexOf(value) === -1
  }


  usersCount = 0;
  initUsersList() {
    this.usersService.getAllUsersHack().subscribe(
      (data: any) => {
        this.listOfOption = data[0].users;
        this.usersCount = data[0]?.metadata?.total;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
