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
      icon: "logo-steam",
    },
    {
      title: "Leads",
      url: "/home",
      icon: "logo-steam",
    },
    {
      title: "All Users",
      url: "/home/users",
      icon: "trash",
    },
    {
      title: "Slides",
      url: "/home/welcome-slides",
      icon: "trash",
    },
    {
      title: "Add User",
      url: "/home/users/signup",
      icon: "heart",
    },
    {
      title: "List Campaigns",
      url: "/home/campaign/list",
      icon: "archive",
    },
    {
      title: "Create Campaign",
      url: "/home/campaigns/create",
      icon: "trash",
    },
    {
      title: "Create Organization",
      url: "/home/create-organization",
      icon: "paper-plane",
    },
    {
      title: "Invoice",
      url: "/home/invoice",
      icon: "trash",
    },
    {
      title: "Followup",
      url: "/home/followup",
      icon: "trash",
    },
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
    private agentService: AgentService
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
  }

  ngOnDestroy() {
    this.subz.unsubscribe();
    this.batteryStatusSubz.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}
