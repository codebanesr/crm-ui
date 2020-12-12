import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { AuthenticationService } from 'src/authentication.service';
import { UsersService } from '../home/users.service';
import { OrganizationService } from '../organization.service';
import { PubsubService } from '../pubsub.service';
import { UploadService } from '../upload.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit {

  organizationForm!: FormGroup;

  submitForm(): void {
    console.log(this.organizationForm.value);
    for (const i in this.organizationForm.controls) {
      this.organizationForm.controls[i].markAsDirty();
      this.organizationForm.controls[i].updateValueAndValidity();
    }

    this.organizationService.createOrganizationAndAdmin(this.organizationForm.value).subscribe(
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
      this.organizationForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private msg: NzMessageService,
    private router: Router,
    private usersService: UsersService,
    private pubsub: PubsubService,
    private uploadService: UploadService
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


  organizationImage = new FormControl('/assets/icon/noimage.jpg');
  email = new FormControl(null, [Validators.required, Validators.email]);
  password= new FormControl([null], [Validators.required]);
  checkPassword= new FormControl([null], [Validators.required, this.confirmationValidator]);
  fullName= new FormControl([null], [Validators.required]);
  organizationName= new FormControl([''],
    [
      Validators.required,
      Validators.maxLength(12),
      Validators.minLength(6),
    ],
    [this.organizationNameValidator]);
  phoneNumber= new FormControl([null], [Validators.required]);
  otp= new FormControl(null, [Validators.required]);
  agree= new FormControl([false]);
  ngOnInit(): void {
    this.pubsub.$pub("HEADING", {heading: "Create Organization"});
    this.organizationForm = this.fb.group({
      email: this.email,
      password: this.password,
      checkPassword: this.checkPassword,
      fullName: this.fullName,
      organizationName: this.organizationName,
      phoneNumber: this.phoneNumber,
      otp: this.otp,
      agree: this.agree,
      organizationImage: this.organizationImage
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
    // const prefix = this.organizationForm.get('phoneNumberPrefix').value;
    const phoneNumber = this.phoneNumber.value;

    this.organizationService.generateAndReceiveOtp(phoneNumber).subscribe(data=>{
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

  async handleIconClick(event) {
    const result: any = await this.uploadService.uploadFile(`${this.organizationName.value}_${new Date().getTime()}`, event.target.files[0]);
    this.organizationImage.setValue(result.Location);
    console.log(this.organizationForm.value, this.organizationImage.value);
  }
}
