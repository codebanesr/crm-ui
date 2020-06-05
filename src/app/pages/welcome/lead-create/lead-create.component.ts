import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadsService } from 'src/app/leads.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-lead-create',
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.scss']
})
export class LeadCreateComponent implements OnInit {

  validateForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private leadService: LeadsService,
    private msg: NzMessageService
  ) {}

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }


    this.leadService.addLead(this.validateForm.value).subscribe(data=>{
      console.log(data);
      this.msg.success("Successfully added Lead");
    }, error=>{
      this.msg.error("Something went wrong while adding lead");
      console.log(error);
    });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }


  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  // customValidator(control: FormControl) {
  //   if (!control.value) {
  //     return { required: true };
  //   } else if (isNaN(control.value)) {
  //     return { amount: true, error: true };
  //   }
  //   return {};
  // }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      _id: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+91'],
      phoneNumber: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      followUp: [null, [Validators.required]],
      agree: [false],
      status: ["NEW", [Validators.required]],
    });
  }

}
