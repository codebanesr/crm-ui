import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { AuthenticationService } from 'src/authentication.service';
import { UsersService } from '../home/users.service';
import { OrganizationService } from '../organization.service';
import { PubsubService } from '../pubsub.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit {

  signupForm!: FormGroup;

  submitForm(): void {
    for (const i in this.signupForm.controls) {
      this.signupForm.controls[i].markAsDirty();
      this.signupForm.controls[i].updateValueAndValidity();
    }

    this.organizationService.createOrganizationAndAdmin(this.signupForm.value).subscribe(
      (data: any) => {
        this.msg.success('Your Account has been registered');
        this.router.navigate(['login']);
      },
      (e: any) => {
        this.msg.error(e.error.message[0]);
      }
    );
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
    private organizationService: OrganizationService,
    private msg: NzMessageService,
    private router: Router,
    private usersService: UsersService,
    private pubsub: PubsubService
  ) {}

  attributeValidator = (label: string) => {
    return (control: FormControl) =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        this.organizationService
          .isAttributeValid({
            label: label,
            value: control.value,
          }).subscribe(
            (result) => {
              observer.next(null);
              observer.complete();
            },
            (error) => {
              console.log("here");
              observer.next({ error: true, duplicated: true });
              observer.complete();
            }
          );
      });
  };

  organizationNameValidator = this.attributeValidator('organizationName');

  ngOnInit(): void {
    this.pubsub.$pub("HEADING", {heading: "Create Organization"});
    this.signupForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      fullName: [null, [Validators.required]],
      organizationName: [
        '',
        [
          Validators.required,
          Validators.maxLength(12),
          Validators.minLength(6),
        ],
        [this.organizationNameValidator],
      ],
      phoneNumberPrefix: ['+91'],
      phoneNumber: [null, [Validators.required]],
      otp: [null, Validators.required],
      agree: [false],
    });
    this.initUsersList();
  }

  listOfOption = [];
  listOfSelectedValue: string[] = [];

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

  onPhoneNumberEnter() {
    const prefix = this.signupForm.get('phoneNumberPrefix').value;
    const phoneNumber = this.signupForm.get('phoneNumber').value;

    this.organizationService.generateAndReceiveOtp(prefix+""+phoneNumber).subscribe(data=>{
      console.log(data);
      this.msg.success("Successfully sent otp to your mobile");
    }, error=>{
      this.msg.error("An error occured while trying to generate otp for your mobile");
      console.error("An error occured", error);
    })
  }

  onPhoneNumberCancel() {
    console.log("Cancelled otp")
  }
}
