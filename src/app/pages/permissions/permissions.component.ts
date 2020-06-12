import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { RoleService } from 'src/app/role.service';

interface DataItem {
  label: string;
  value: string;
  checked: boolean;
  _id: string;
}



@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  validateForm!: FormGroup;
  listOfColumn = [
    {
      title: 'Label'
    },
    {
      title: 'Value',
      priority: 3
    },
    {
      title: 'checked',
      priority: 2
    },
    {
      title: '_id',
      priority: 1
    }
  ];



  listOfData: DataItem[] = [];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService
  ) {}

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }


    if(this.validateForm.valid) {
      this.roleService.addPermission(this.validateForm.value).subscribe(data=>{
        console.log(data);
        this.initTable()
      }, error=>{
        console.log(error);
      })
    }
  }

  ngOnInit(): void {
    this.initForm();

    this.initTable();
  }


  initForm() {
    this.validateForm = this.fb.group({
      label: [null, [Validators.required]],
      value: [null, [Validators.required]],
      checked: [null, [Validators.required]],
    });
  }


  initTable() {
    this.roleService.getAllPermissions().subscribe((data: any[])=>{
      this.listOfData = data;
    }, error=>{

    })
  }
}
