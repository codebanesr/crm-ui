import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CurrentUser } from '../home/interfaces/global.interfaces';
import { UsersService } from '../home/users.service';
import { UploadService } from '../upload.service';
import { MyErrorStateMatcher } from './error-state-matcher';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private uploadService: UploadService,
    private userService: UsersService
  ) {}


  matcher = new MyErrorStateMatcher();
  userimage = "captain america here";
  ngOnInit() {
    this.initProfileForm();
  }

  /** @Todo add email field when mapping has been removed  */
  fullName = new FormControl("", [
    Validators.required,
    Validators.minLength(3),
  ]);
  password = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
  ]);
  newPassword = new FormControl("");
  confirmNewPassword = new FormControl("");

  phoneNumber = new FormControl("", [
    Validators.pattern("[0-9 ]{10,13}"),
    Validators.required,
  ]);

  checkPassword(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('newPassword').value;
    const confirmPassword = group.get('confirmNewPassword').value;
  
    return password === confirmPassword ? null : { notSame: true }     
  }

  initProfileForm() {
    this.profileForm = this.fb.group({
      fullName: this.fullName,
      password: this.password,
      phoneNumber: this.phoneNumber,
      newPassword: this.newPassword,
      confirmNewPassword: this.confirmNewPassword,
    }, { validators: this.checkPassword });

    this.userService.getUserProfile().subscribe(
      (info) => {
        this.profileForm.patchValue(info);
      },
      (error) => {
        alert("Failed to fetch user profile");
      }
    );
  }

  showProfileActions = false;
  async handleIconClick(event) {
    const result: any = await this.uploadService.uploadFile(
      `${this.profileForm.get("firstName")}_${new Date().getTime()}`,
      event.target.files[0]
    );
    this.userimage = result.Location;
  }

  handleProfileSubmit() {
    console.log(this.profileForm.value);
  }
}


