import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeadCreateComponent } from './lead-create/lead-create.component';
import { LeadsComponent } from './leads/leads.component';
import { TicketCreateComponent } from './ticket-create/ticket-create.component';
import { TicketsComponent } from './tickets/tickets.component';
import { UploadsComponent } from './uploads/uploads.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UsersComponent } from './users/users.component';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { RouterModule } from '@angular/router';
import { DemoNgZorroAntdModule } from './antd.module';
import { TimelineModalComponent } from '../timeline-modal/timeline-modal.component';
import { AlarmsComponent } from '../alarms/alarms.component';
import { authInterceptorProviders } from 'src/helpers/auth.interceptor';
import { CampaignComponent } from './campaign/campaign.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { RoleComponent } from '../role/role.component';
import { PermissionsComponent } from '../permissions/permissions.component';
import { RoleCreateComponent } from '../role-create/role-create.component';
import { AdminActionsComponent } from '../admin-actions/admin-actions.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';
import { FormlyDatePicker } from 'src/app/custom-templates/date-picker';
import { LeadSoloComponent } from './lead-solo/lead-solo.component';


@NgModule({
  imports: [
    RouterModule,
    WelcomeRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DemoNgZorroAntdModule,
    FormlyNgZorroAntdModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      types: [
        { name: 'datePicker', component: FormlyDatePicker }
      ]
    }),
  ],
  declarations: [
    WelcomeComponent,
    LeadsComponent,
    TicketsComponent,
    UploadsComponent,
    UsersComponent,
    LeadCreateComponent,
    TicketCreateComponent,
    UserCreateComponent,
    TimelineModalComponent,
    AlarmsComponent,
    CampaignComponent,
    CreateCampaignComponent,
    RoleComponent,
    PermissionsComponent,
    RoleCreateComponent,
    AdminActionsComponent,
    FormlyDatePicker,
    LeadSoloComponent
  ],
  exports: [WelcomeComponent],
  providers: [authInterceptorProviders],
})
export class WelcomeModule {}
