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



@NgModule({
  imports: [
    RouterModule,
    WelcomeRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DemoNgZorroAntdModule
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
  ],
  exports: [WelcomeComponent],
})
export class WelcomeModule {}
