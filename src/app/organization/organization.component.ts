import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import { OrganizationService } from '../organization.service';
import { UsersService } from '../service/users.service';

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
        this.router.navigate(['welcome', 'leads', 'all']);
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
    private usersService: UsersService
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
      phoneNumberPrefix: ['+86'],
      phoneNumber: [null, [Validators.required]],
      roleType: [null, Validators.required],
      manages: [[], Validators.required],
      reportsTo: [null, Validators.required],
      agree: [false],
    });
    this.initUsersList();
  }

  listOfOption = [];
  listOfSelectedValue: string[] = [];

  isNotSelected(value: string): boolean {
    // return this.listOfSelectedValue.indexOf(value) === -1;
    return this.signupForm.get('manages').value.indexOf(value) === -1;
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
