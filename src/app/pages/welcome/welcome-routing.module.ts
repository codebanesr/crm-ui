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
import { OverviewComponent } from 'src/app/overview/overview.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { RoleComponent } from '../role/role.component';
import { PermissionsComponent } from '../permissions/permissions.component';
import { RoleCreateComponent } from '../role-create/role-create.component';
import { AdminActionsComponent } from '../admin-actions/admin-actions.component';
import { CampaignOverviewComponent } from 'src/app/campaign-overview/campaign-overview.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'overview'},
    component: OverviewComponent,
  },
  {
    path: 'campaign-overview',
    component: CampaignOverviewComponent,
    data: {
      breadcrumb: 'campaign-overview'
    }
  },
  {
    path: routePoints.USERS,
    data: {
      breadcrumb: 'users',
    },
    children: [
      {
        path: '',
        component: UsersComponent,
      },
      {
        path: "create",
        component: UserCreateComponent,
        data: {
          breadcrumb: 'create-user',
        },
      },
    ],
  },
  {
    path: routePoints.LEADS,
    data: {
      breadcrumb: 'leads',
    },
    children: [
      {
        path: '',
        component: LeadsComponent,
      },
      {
        path: 'create',
        component: LeadCreateComponent,
        data: {
          breadcrumb: 'create',
        },
      },
    ],
  },
  {
    path: routePoints.TICKETS,
    data: {
      breadcrumb: 'tickets',
    },
    children: [
      {
        path: '',
        component: TicketsComponent,
      },
      {
        path: 'create',
        component: TicketCreateComponent,
        data: {
          breadcrumb: 'create',
        },
      },
    ],
  },
  {
    path: routePoints.UPLOADS,
    component: UploadsComponent,
    data: {
      breadcrumb: 'uploads',
    },
  },
  {
    path: routePoints.ALARMS,
    component: AlarmsComponent,
    data: {
      breadcrumb: 'alarms',
    },
  },
  {
    path: 'customers',
    component: CustomersComponent,
    data: {
      breadcrumb: 'show-customers',
    },
    children: [
      {
        path: 'create',
        component: CustomerCreateComponent,
        data: {
          breadcrumb: 'create-customer',
        },
      },
    ],
  },
  {
    path: 'overview',
    component: OverviewComponent,
    data: {
      breadcrumb: 'overview',
    },
  },
  {
    path: 'campaigns',
    children: [
      {
        path: '',
        component: CampaignComponent,
        data: {
          breadcrumb: 'campaigns',
        },
      },
      {
        path: 'create',
        component: CreateCampaignComponent,
        data: {
          breadcrumb: 'create-campaigns',
        },
      },
    ],
  },
  {
    path: 'role',
    component: RoleComponent,
    data: {
      breadcrumb: 'roles',
    },
    children: [
      {
        path: 'create',
        component: RoleCreateComponent,
        data: {
          breadcrumb: 'create-role',
        },
      },
    ],
  },
  {
    path: 'permission',
    component: PermissionsComponent,
    data: {
      breadcrumb: 'permissions',
    },
  },
  {
    path: 'agent/actions',
    component: AdminActionsComponent,
    data: {
      breadcrumb: 'actions',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
