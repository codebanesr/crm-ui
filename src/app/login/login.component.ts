import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private msg: NzMessageService,
  ) { }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const { userName, password } = this.validateForm.value;
    this.authService.login(userName, password).subscribe((data: any)=>{
      this.msg.success("Successfully Logged In");
    }, (error: Error)=>{
      this.msg.error("Incorrect username or password");
    })
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

}
