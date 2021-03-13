import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadService } from '../upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private uploadService: UploadService
  ) { }

  userimage='captain america here';
  ngOnInit() {
    this.initProfileForm();
  }

  /** @Todo add email field when mapping has been removed  */
  firstName = new FormControl('', [Validators.required, Validators.minLength(3)]);
  lastName = new FormControl('', [Validators.required, Validators.minLength(3)]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  mobileNumber = new FormControl('', [Validators.pattern("[0-9 ]{10,13}"), Validators.required]);

  initProfileForm() {
    this.profileForm = this.fb.group({
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      mobileNumber: this.mobileNumber
    })
  }

  showProfileActions = false;
  async handleIconClick(event) {
    const result: any = await this.uploadService.uploadFile(`${this.profileForm.get('firstName')}_${new Date().getTime()}`, event.target.files[0]);
    this.userimage =  result.Location;
  }


  handleProfileSubmit() {
    console.log(this.profileForm.value);
  }
}
