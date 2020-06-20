import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadsService } from 'src/app/leads.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ILeadColumn } from '../leads/lead.interface';
import { FormlyFieldConfig } from '@ngx-formly/core';



@Component({
  selector: 'app-lead-create',
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.scss']
})
export class LeadCreateComponent implements OnInit {

  typeDict: { [key: string]: { label: string, value: string, type: string, checked: boolean } };
  validateForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private leadService: LeadsService,
    private msg: NzMessageService
  ) { }


  ngOnInit(): void {
    this.initForm();
    this.mapLabelValues();
  }

  submitForm(): void {
    console.log(this.model, this.validateForm.value);
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }


    this.leadService.addLead(this.validateForm.value).subscribe(data => {
      console.log(data);
      this.msg.success("Successfully added Lead");
    }, error => {
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

  model: any;
  fields: FormlyFieldConfig[]
  initForm() {
    this.validateForm = new FormGroup({});
    this.model = {};
    this.fields = [];

    let res = []
    this.leadService.getAllLeadColumns().subscribe((results: any) => {
      results.paths.forEach(path=>{
        res.push({
          key: path.internalField,
          type: path.type === 'date'? 'datePicker': 'input',
          templateOptions: {
            label: path.readableField,
            placeholder: path.readableField,
            required: true,
          }
        })
      })
      this.fields = res;
    })
  }

  mapLabelValues() {
    let showCols: any[] = [];
    this.leadService.getAllLeadColumns().subscribe((mSchema: { paths: ILeadColumn[] }) => {
      mSchema.paths.forEach((path: ILeadColumn) => {
        showCols.push({
          label: path.readableField,
          value: path.internalField,
          checked: path.checked,
          type: path.type
        })
      });

      // for tables
      this.typeDict = Object.assign({}, ...showCols.map((x) => ({ [x.value]: x })));
    })
  }
}
