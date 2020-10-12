import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadsComponent } from './leads/leads.component';
import { TicketsComponent } from './tickets/tickets.component';
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
import { LeadSoloComponent } from './lead-solo/lead-solo.component';
import { ConferenceComponent } from './conference/conference.component';
import { ChatComponent } from './chat/chat.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { InvoiceComponent } from './invoice/invoice.component';

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
    path: 'users',
    data: {
      breadcrumb: 'user'
    },
    children: [
      {
        path: '',
        component: UsersComponent,
        data: {
          breadcrumb: 'users',
        },
      },
      {
        path: 'details/:email',
        component: UserDetailsComponent,
        data: {
          breadcrumb: 'details'
        }
      },
      {
        path: "create",
        component: UserCreateComponent,
        data: {
          breadcrumb: 'create-user',
        },
      },
      {
        path: "conference",
        component: ConferenceComponent,
        data: {
          breadcrumb: 'conference'
        }
      },
      {
        path: "chat",
        component: ChatComponent,
        data: {
          breadcrumb: 'chat'
        }
      }
    ],
  },
  {
    path: 'leads',
    data: {
      breadcrumb: 'lead',
    },
    children: [
      {
        path: 'all',
        component: LeadsComponent,
      },
      {
        path: 'create',
        component: LeadCreateComponent,
        data: {
          breadcrumb: 'create',
        },
      },
      {
        path: 'solo',
        component: LeadSoloComponent,
        data: {
          breadcrumb: 'solo',
        },
      },
    ],
  },
  {
    path: 'tickets',
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
    path: 'uploads',
    component: UploadsComponent,
    data: {
      breadcrumb: 'uploads',
    },
  },
  {
    path: 'alarm',
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
    data: {
      breadcrumb: 'campaign'
    },
    children: [
      {
        path: 'list',
        component: CampaignComponent,
        data: {
          breadcrumb: 'list',
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
    data: {
      breadcrumb: 'role',
    },
    children: [
      {
        path: 'list',
        component: RoleComponent,
        data: {
          breadcrumb: 'list-roles'
        }
      },
      {
        path: 'create',
        component: RoleCreateComponent,
        data: {
          breadcrumb: 'create-role',
        },
      },
      {
        path: 'permission',
        component: PermissionsComponent,
        data: {
          breadcrumb: 'permission',
        },
      },
    ],
  },
  {
    path: 'agent/actions',
    component: AdminActionsComponent,
    data: {
      breadcrumb: 'actions',
    },
  },
  {
    path: 'invoice',
    component: InvoiceComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
