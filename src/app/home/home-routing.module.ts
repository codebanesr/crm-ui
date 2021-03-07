import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CampaignCreateComponent } from "../campaign-create/campaign-create.component";
import { CampaignComponent } from "../campaign/campaign.component";
import { FollowupComponent } from "../followup/followup.component";
import { GeomarkerComponent } from "../geomarker/geomarker.component";
import { InvoiceComponent } from "../invoice/invoice.component";
import { LeadCreateComponent } from "../lead-create/lead-create.component";
import { MappingComponent } from "../mapping/mapping.component";
import { OrganizationComponent } from "../organization/organization.component";
import { ProfileComponent } from '../profile/profile.component';
import { SignupComponent } from "../signup/signup.component";
import { LeadHistoryComponent } from "../lead-history/lead-history.component";
import { UsersComponent } from "../users/users.component";
import { WelcomeSlidesComponent } from "../welcome-slides/welcome-slides.component";
import { HomePage } from "./home.page";
import { LeadSoloComponent } from "./lead-solo/lead-solo.component";
import { LeadsComponent } from "./leads/leads.component";

const routes: Routes = [
  {
    path: "geomarker",
    component: GeomarkerComponent,
    pathMatch: "full",
  },
  {
    path: "welcome-slides",
    component: WelcomeSlidesComponent,
    pathMatch: "full",
  },
  {
    path: "create-organization",
    component: OrganizationComponent,
    pathMatch: "full",
  },
  {
    path: "users",
    component: UsersComponent,
    pathMatch: "full",
  },
  {
    path: "users/signup",
    component: SignupComponent,
    pathMatch: "full",
  },
  {
    path: "solo",
    component: LeadSoloComponent,
    pathMatch: "full",
  },
  {
    path: "lead-create",
    component: LeadCreateComponent,
    pathMatch: "full",
  },
  {
    path: "campaign/list",
    component: CampaignComponent,
    pathMatch: "full",
  },
  {
    path: "campaigns/create",
    component: CampaignCreateComponent,
    pathMatch: "full",
  },
  {
    path: "",
    component: LeadsComponent,
    pathMatch: "full",
  },
  {
    path: "invoice",
    component: InvoiceComponent,
    pathMatch: "full",
  },
  {
    path: "followup",
    component: FollowupComponent,
    pathMatch: "full",
  },
  {
    path: "transactions",
    component: LeadHistoryComponent,
    pathMatch: "full",
  },
  {
    path: "profile",
    component: ProfileComponent,
    pathMatch: 'full'
  },
  {
    path: "mapping",
    pathMatch: 'full',
    component: MappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
