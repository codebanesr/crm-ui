import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomePage } from "./home.page";

import { HomePageRoutingModule } from "./home-routing.module";
import { LeadAutodial, LeadSoloComponent } from "./lead-solo/lead-solo.component";
import { LeadsComponent } from "./leads/leads.component";
import { ModantdModule } from "./modantd/modantd.module";
import { UsersComponent } from "../users/users.component";
import { CampaignComponent } from "../campaign/campaign.component";
import { SignupComponent } from "../signup/signup.component";
import { OrganizationComponent } from "../organization/organization.component";
import { CampaignCreateComponent } from "../campaign-create/campaign-create.component";
import { InvoiceComponent } from "../invoice/invoice.component";
import { FollowupComponent } from "../followup/followup.component";
import { NgZorroAntdMobileModule } from "ng-zorro-antd-mobile";
import { WelcomeSlidesComponent } from "../welcome-slides/welcome-slides.component";
import { LeadCreateComponent } from "../lead-create/lead-create.component";
import { LeadHistoryComponent } from "../lead-history/lead-history.component";
import { DemoMaterialModule } from "../material/material.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ProfileComponent } from '../profile/profile.component';
import { AddConfigComponent, MappingComponent } from "../mapping/mapping.component";
import { GeomarkerComponent } from "../geomarker/geomarker.component";
import {GoogleMapsModule} from '@angular/google-maps';
import { CountdownModule } from 'ngx-countdown';


@NgModule({
  imports: [
    GoogleMapsModule,
    CountdownModule,
    NgxMatSelectSearchModule,
    ScrollingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    ModantdModule,
    NgZorroAntdMobileModule,
    DemoMaterialModule,
  ],
  declarations: [
    ProfileComponent,
    GeomarkerComponent,
    FollowupComponent,
    HomePage,
    LeadSoloComponent,
    LeadsComponent,
    UsersComponent,
    CampaignComponent,
    SignupComponent,
    OrganizationComponent,
    CampaignCreateComponent,
    InvoiceComponent,
    WelcomeSlidesComponent,
    LeadCreateComponent,
    LeadHistoryComponent,
    MappingComponent,
    AddConfigComponent,
    LeadAutodial,
  ],
  providers: []
})
export class HomePageModule {}
