import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { LeadSoloComponent } from './lead-solo/lead-solo.component';
import { LeadsComponent } from './leads/leads.component';
import { ModantdModule } from './modantd/modantd.module';
import { UsersComponent } from '../users/users.component';
import { CampaignComponent } from '../campaign/campaign.component';
import { SignupComponent } from '../signup/signup.component';
import { OrganizationComponent } from '../organization/organization.component';
import { CampaignCreateComponent } from '../campaign-create/campaign-create.component';


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
    LeadsComponent,
    UsersComponent,
    CampaignComponent,
    SignupComponent,
    OrganizationComponent,
    CampaignCreateComponent
  ]
})
export class HomePageModule {}
