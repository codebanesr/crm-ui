import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RulesRoutingModule } from './rules-routing.module';
import { AddRulesComponent } from './add-rules/add-rules.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../material/material.module';
import { IonicModule } from '@ionic/angular';
import { ListRulesComponent } from './list-rules/list-rules.component';



@NgModule({
  declarations: [
    AddRulesComponent,
    ListRulesComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RulesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule
  ]
})
export class RulesModule { }
