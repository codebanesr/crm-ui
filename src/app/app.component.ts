import { Component, Inject, OnDestroy, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { PubsubService } from "./pubsub.service";
import { Subscription } from "rxjs";
import { AuthenticationService } from "src/authentication.service";
import { BatteryStatus } from "@ionic-native/battery-status/ngx";
import { AgentService } from "./agent.service";
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationResponse,
} from "@ionic-native/background-geolocation/ngx";
import { CurrentUser } from "./home/interfaces/global.interfaces";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private pubsub: PubsubService,
    public authService: AuthenticationService,
    private batteryStatus: BatteryStatus,
    private agentService: AgentService,
    private backgroundGeolocation: BackgroundGeolocation
  ) {
    
    this.initializeApp();
  }

  currentUser: any;
  organizationName: string;
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });


    this.authService.currentUser.subscribe((cu: CurrentUser)=>{
      this.currentUser = cu;
      this.organizationName = cu?.organization;
    });
  }

  heading: string = "Leads";


  subz: Subscription;
  batteryStatusSubz: Subscription;

  ngOnInit() {
    this.subz = this.pubsub.$sub("HEADING", (data) => {
      this.heading = data.heading;
    });

    this.batteryStatusSubz = this.batteryStatus
      .onChange()
      .subscribe((status) => {
        this.agentService.updateBatteryStatus(status.level).subscribe((res) => {
          
        });
      });

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true, // enable this to clear background location settings when the app terminates,
      notificationText: "Your Location is being recorded",
    };

    this.backgroundGeolocation.configure(config).then(() => {
      
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          this.agentService.addVisitTrack({coordinate: {lat: location.latitude, lng: location.longitude}}).subscribe(vt=>{
            
          })
        });
    }).catch(e=>{
      
    });


    this.backgroundGeolocation.start();
  }

  ngOnDestroy() {
    this.subz.unsubscribe();
    this.batteryStatusSubz.unsubscribe();
  }
}
