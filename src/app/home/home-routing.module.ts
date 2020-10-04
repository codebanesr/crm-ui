import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { LeadSoloComponent } from './lead-solo/lead-solo.component';
import { LeadsComponent } from './leads/leads.component';

const routes: Routes = [
  {
    path: 'solo',
    component: LeadSoloComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: LeadsComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
