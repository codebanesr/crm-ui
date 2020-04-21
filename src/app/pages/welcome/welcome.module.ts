import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';




@NgModule({
  imports: [WelcomeRoutingModule, NzBadgeModule],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
