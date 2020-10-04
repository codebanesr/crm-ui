import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { LeadSoloComponent } from './lead-solo/lead-solo.component';
import { LeadsComponent } from './leads/leads.component';
import { ModantdModule } from './modantd/modantd.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    ModantdModule
  ],
  declarations: [
    HomePage,
    LeadSoloComponent,
    LeadsComponent
  ]
})
export class HomePageModule {}
