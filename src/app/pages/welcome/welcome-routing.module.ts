import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { LeadsComponent } from './leads/leads.component';
import { TicketsComponent } from './tickets/tickets.component';
import { routePoints } from '../../../menus/routes';
import { UploadsComponent } from './uploads/uploads.component';
import { UsersComponent } from './users/users.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { LeadCreateComponent } from './lead-create/lead-create.component';
import { TicketCreateComponent } from './ticket-create/ticket-create.component';
import { AlarmsComponent } from '../alarms/alarms.component';
import { CustomerCreateComponent } from 'src/app/customer-create/customer-create.component';
import { CustomersComponent } from 'src/app/customers/customers.component';


const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {path: routePoints.USERS, component: UsersComponent},
  { path: routePoints.LEADS, component: LeadsComponent},
  {path: routePoints.TICKETS, component: TicketsComponent},
  {path: routePoints.UPLOADS, component: UploadsComponent},
  {path: routePoints.USER_CREATE, component: UserCreateComponent},
  {path: routePoints.LEAD_CREATE, component: LeadCreateComponent},
  {path: routePoints.TICKET_CREATE, component: TicketCreateComponent},
  {path: routePoints.ALARMS, component: AlarmsComponent},
  {path: "customer-create", component: CustomerCreateComponent},
  {path: "customer/show", component: CustomersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
