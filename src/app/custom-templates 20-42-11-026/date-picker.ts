import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-date-picket',
  template: `
   <nz-form-item>
        <nz-form-label nzRequired>{{to.label}}</nz-form-label>
        <nz-form-control>
          <nz-date-picker [formControl]="formControl" [formlyAttributes]="field"></nz-date-picker>
        </nz-form-control>
      </nz-form-item>
 `,
})

export class FormlyDatePicker extends FieldType {

}
