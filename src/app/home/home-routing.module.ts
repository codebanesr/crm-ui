import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CampaignCreateComponent } from "../campaign-create/campaign-create.component";
import { CampaignComponent } from "../campaign/campaign.component";
import { FollowupComponent } from "../followup/followup.component";
import { InvoiceComponent } from "../invoice/invoice.component";
import { OrganizationComponent } from "../organization/organization.component";
import { SignupComponent } from "../signup/signup.component";
import { UsersComponent } from "../users/users.component";
import { WelcomeSlidesComponent } from "../welcome-slides/welcome-slides.component";
import { HomePage } from "./home.page";
import { LeadSoloComponent } from "./lead-solo/lead-solo.component";
import { LeadsComponent } from "./leads/leads.component";

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
