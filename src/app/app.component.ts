import { Component, OnDestroy, OnInit } from "@angular/core";

import { MenuController, Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
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

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [
    {
      title: "Transactions",
      url: "/home/transactions",
      icon: "card_membership",
    },
    {
      title: "Leads",
      url: "/home",
      icon: "person_search",
    },
    {
      title: "All Users",
      url: "/home/users",
      icon: "supervisor_account",
    },
    {
      title: "Slides",
      url: "/home/welcome-slides",
      icon: "pages",
    },
    {
      title: "Add User",
      url: "/home/users/signup",
      icon: "person_add_alt_1",
    },
    {
      title: "List Campaigns",
      url: "/home/campaign/list",
      icon: "format_list_bulleted",
    },
    {
      title: "Create Campaign",
      url: "/home/campaigns/create",
      icon: "playlist_add",
    },
    {
      title: "Create Organization",
      url: "/home/create-organization",
      icon: "corporate_fare",
    },
    {
      title: "Invoice",
      url: "/home/invoice",
      icon: "receipt",
    },
    {
      title: "Followup",
      url: "/home/followup",
      icon: "pending_actions",
    },
    {
      title: "List Reseller",
      url: "/reseller/organization/list",
      icon: "format_list_numbered",
    },    {
      title: "Create Reseller",
      url: "/reseller/create",
      icon: "add_business",
    }, 
    {
      title: "Track Users",
      url: "/reports/tracker",
      icon: "timeline",
    }
  ];

  routeTo(url: string) {
    let routeArray = url.split("/");
    this.router.navigate(routeArray);
    this.menuController.close();
  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menuController: MenuController,
    private pubsub: PubsubService,
    public authService: AuthenticationService,
    private batteryStatus: BatteryStatus,
    private agentService: AgentService,
    private backgroundGeolocation: BackgroundGeolocation
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openMenu() {
    this.menuController.open();
  }

  heading: string = "Leads";

  showNav: boolean = false;

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
          console.log(res);
        });
      });

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates,
      notificationText: "Tracking Geolocation",
    };

    this.backgroundGeolocation.configure(config).then(() => {
      console.log("promise for background geolocation resolved");
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          this.agentService.addVisitTrack({coordinate: {lat: location.latitude, lng: location.longitude}}).subscribe(vt=>{
            console.log("added visit track", vt);
          })
        });
    }).catch(e=>{
      console.log("error occured while starting background location");
    });


    this.backgroundGeolocation.start();
  }

  ngOnDestroy() {
    console.log(
      "finishing all tasks, destroying app component, geolocation and battery wont work"
    );
    this.subz.unsubscribe();
    this.batteryStatusSubz.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}
