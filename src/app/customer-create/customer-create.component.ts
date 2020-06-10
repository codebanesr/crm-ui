import { Component, OnInit } from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit {

  constructor() { }

  form: FormGroup;
  model: any;
  fields: FormlyFieldConfig[];
  ngOnInit(): void {
    this.form = new FormGroup({});
    this.model = { email: 'email@gmail.com' };
    this.fields = [
      {
        key: 'Select',
        type: 'select',
        templateOptions: {
          label: 'Select',
          placeholder: 'Placeholder',
          description: 'Description',
          required: true,
          options: [
            { value: 1, label: 'Option 1' },
            { value: 2, label: 'Option 2' },
            { value: 3, label: 'Option 3' },
            { value: 4, label: 'Option 4' },
          ],
        },
      },
      {
        key: 'select_multi',
        type: 'select',
        templateOptions: {
          label: 'Select Multiple',
          placeholder: 'Placeholder',
          description: 'Description',
          required: true,
          multiple: true,
          selectAllOption: 'Select All',
          options: [
            { value: 1, label: 'Option 1' },
            { value: 2, label: 'Option 2' },
            { value: 3, label: 'Option 3' },
            { value: 4, label: 'Option 4' },
          ],
        },
      },
    ];
  }

  submit(model) {
    console.log(model);
  }

}
