import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';

import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { LoginComponent } from './login/login.component';
import { DemoNgZorroAntdModule } from './pages/welcome/antd.module';
import { authInterceptorProviders } from '../helpers/auth.interceptor';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomersComponent } from './customers/customers.component';
import { OverviewComponent } from './overview/overview.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CustomerCreateComponent,
    CustomersComponent,
    OverviewComponent,
  ],
  imports: [
    NgxChartsModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
