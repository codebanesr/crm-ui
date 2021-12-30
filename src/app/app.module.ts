import { NgModule } from "@angular/core";
import { BrowserModule, HammerModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ModantdModule } from "./home/modantd/modantd.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "src/login/login.component";
import { authInterceptorProviders } from "./helpers/auth.interceptor";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { en_US, NZ_I18N } from "ng-zorro-antd/i18n";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Contacts } from "@ionic-native/contacts/ngx";
import { DemoMaterialModule } from "./material/material.module";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BatteryStatus } from "@ionic-native/battery-status/ngx";
import { BackgroundGeolocation } from "@ionic-native/background-geolocation/ngx";
import { CallLog } from "@ionic-native/call-log/ngx";
import { MainSidebarComponent } from "./main-container/main-sidebar/main-sidebar.component";
import { MainTabsComponent } from "./main-container/main-tabs/main-tabs.component";
import { MainToolbarComponent } from "./main-container/main-toolbar/main-toolbar.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { ExceptionInterceptorProvider } from "./helpers/exception.interceptor";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import {
  NgMaterialMultilevelMenuModule,
  MultilevelMenuService,
} from "ng-material-multilevel-menu";
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainSidebarComponent,
    MainTabsComponent,
    MainToolbarComponent,
  ],
  entryComponents: [],
  imports: [
    NgMaterialMultilevelMenuModule,
    ModantdModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HammerModule,
    SocialLoginModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: BackgroundGeolocation, useClass: BackgroundGeolocation },
    BatteryStatus,
    CallNumber,
    CallLog,
    MultilevelMenuService,
    Contacts,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: NZ_I18N, useValue: en_US },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    authInterceptorProviders,
    ExceptionInterceptorProvider,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.oauth.google.clientId
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
