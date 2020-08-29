import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoleService } from 'src/app/role.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private msgService: NzMessageService
  ) {}
  listOfOption: any[]
  ngOnInit(): void {
    this.initForm();
    this.initAutoComplete();
  }

  initForm() {
    this.validateForm = this.fb.group({
      label: [null, [Validators.required]],
      value: [null, [Validators.required]],
      permissions: [null, [Validators.required]],
    });
  }

  createNewRole(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }


    console.log(this.validateForm.value)
    if(this.validateForm.valid) {
      this.roleService.createOrUpdateRole(this.validateForm.value).subscribe(data=>{
        this.msgService.success("Successfully updated roles with permissions");
      }, error=>{
          this.msgService.error("An error occured while updating roles with permissions");
      })
    }
  }

  initAutoComplete() {
    this.roleService.getAllPermissions().subscribe((optionList: any[])=>{
      this.listOfOption = optionList;
    })
  }


}
