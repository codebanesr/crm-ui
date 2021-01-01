import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../material/material.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { LocationTrackerComponent } from './location-tracker/location-tracker.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';



@NgModule({
  declarations: [
    LocationTrackerComponent
  ],
  imports: [
    ReportsRoutingModule,
    NgxMatSelectSearchModule,
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule
  ]
})
export class ReportsModule { }
