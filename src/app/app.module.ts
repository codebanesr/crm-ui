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

/** use custom build, this will import everything */
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { CampaignOverviewComponent } from './campaign-overview/campaign-overview.component';
import { UserDetailsComponent } from './pages/welcome/user-details/user-details.component';
import { SignupComponent } from './signup/signup.component';
import { OrganizationComponent } from './organization/organization.component';
import { ForgotPasswordVerifyComponent } from './forgot-password-verify/forgot-password-verify.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CustomerCreateComponent,
    CustomersComponent,
    OverviewComponent,
    CampaignOverviewComponent,
    UserDetailsComponent,
    SignupComponent,
    OrganizationComponent,
    ForgotPasswordVerifyComponent,
    DynamicFormComponent,
  ],
  imports: [
    DemoNgZorroAntdModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
    ReactiveFormsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
