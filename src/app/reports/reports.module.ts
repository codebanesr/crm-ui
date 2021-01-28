import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../material/material.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { LocationTrackerComponent } from './location-tracker/location-tracker.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { GoogleMapsModule } from '@angular/google-maps';
import { BarChartComponent } from './app-bar-chart/app-bar.component';
import { InteractionComponent } from './interaction/pie.component';
import { GraphsComponent } from './graphs/graphs.component';
import { StackBarChart } from './app-stack-bar/app-stack-bar.component';



@NgModule({
  imports: [
    GoogleMapsModule,
    ReportsRoutingModule,
    NgxMatSelectSearchModule,
    CommonModule,
    IonicModule, 
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule
  ],
  declarations: [
    LocationTrackerComponent,
    BarChartComponent,
    InteractionComponent,
    StackBarChart,
    GraphsComponent
  ],
})
export class ReportsModule { }
