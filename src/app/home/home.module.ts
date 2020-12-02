import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomePage } from "./home.page";

import { HomePageRoutingModule } from "./home-routing.module";
import { LeadSoloComponent } from "./lead-solo/lead-solo.component";
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
import { TransactionsComponent } from "../transactions/transactions.component";
import { DemoMaterialModule } from "../material/material.module";
import { ScrollingModule } from "@angular/cdk/scrolling";

@NgModule({
  imports: [
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
    TransactionsComponent,
  ],
})
export class HomePageModule {}
