import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { LeadsComponent } from './leads/leads.component';
import { TicketsComponent } from './tickets/tickets.component';
import { routePoints } from '../../../menus/routes';
import { UploadsComponent } from './uploads/uploads.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {path: routePoints.USERS, component: UsersComponent},
  { path: routePoints.LEADS, component: LeadsComponent},
  {path: routePoints.TICKETS, component: TicketsComponent},
  {path: routePoints.UPLOADS, component: UploadsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
