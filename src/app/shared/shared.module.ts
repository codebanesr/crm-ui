import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DndModule } from 'ngx-drag-drop';
import { ModantdModule } from '../home/modantd/modantd.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { SharedRoutingModule } from './shared-routing.module';
import { DynamicFormPreviewComponent } from './dynamic-form-preview/dynamic-form-preview.component';


@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicFormPreviewComponent
  ],
  imports: [
    SharedRoutingModule,
    DndModule,
    ModantdModule,
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    NzFormModule,
    NzSwitchModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputModule,
    NzRadioModule
  ],
  exports: [
    DynamicFormComponent,
    DynamicFormPreviewComponent
  ]
})
export class SharedModule { }
