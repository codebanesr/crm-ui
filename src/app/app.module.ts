import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
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
import {
  LOCAL_PROVIDER_TOKEN,
  NgZorroAntdMobileModule,
} from "ng-zorro-antd-mobile";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Contacts } from "@ionic-native/contacts/ngx";
import { DemoMaterialModule } from "./material/material.module";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BatteryStatus } from "@ionic-native/battery-status/ngx";
import { BackgroundGeolocation } from "@ionic-native/background-geolocation/ngx";
import { CallLog } from "@ionic-native/call-log/ngx";


@NgModule({
  declarations: [AppComponent, LoginComponent],
  entryComponents: [],
  imports: [
    ModantdModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    {provide: BackgroundGeolocation, useClass: BackgroundGeolocation},
    BatteryStatus,
    CallNumber,
    CallLog,
    Contacts,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: NZ_I18N, useValue: en_US },
    { provide: LOCAL_PROVIDER_TOKEN, useValue: en_US },
    authInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
