import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { LeadsComponent } from './leads/leads.component';
import { TicketsComponent } from './tickets/tickets.component';
import { UploadsComponent } from './uploads/uploads.component';
import { UsersComponent } from './users/users.component';




@NgModule({
  imports: [WelcomeRoutingModule, NzBadgeModule],
  declarations: [WelcomeComponent, LeadsComponent, TicketsComponent, UploadsComponent, UsersComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
