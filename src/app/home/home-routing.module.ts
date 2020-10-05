import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignComponent } from '../campaign/campaign.component';
import { SignupComponent } from '../signup/signup.component';
import { UsersComponent } from '../users/users.component';
import { HomePage } from './home.page';
import { LeadSoloComponent } from './lead-solo/lead-solo.component';
import { LeadsComponent } from './leads/leads.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    pathMatch: 'full'
  },
  {
    path: 'users/signup',
    component: SignupComponent,
    pathMatch: 'full'
  },
  {
    path: 'solo',
    component: LeadSoloComponent,
    pathMatch: 'full'
  },
  {
    path: 'campaign/list',
    component: CampaignComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: LeadsComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
