import { Component, OnDestroy, OnInit } from "@angular/core";

import { MenuController, Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { PubsubService } from "./pubsub.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [
    {
      title: "Leads",
      url: "/home",
      icon: "logo-steam",
    },
    {
      title: "Single Lead",
      url: "/home/solo",
      icon: "paper-plane",
    },
    {
      title: "All Users",
      url: "/home/users",
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
      url: "/home/create-campaign",
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
    private pubsub: PubsubService
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
  subz: Subscription;
  ngOnInit() {
    this.subz = this.pubsub.$sub("HEADING", (data) => {
      this.heading = data.heading;
    });
  }

  ngOnDestroy() {
    this.subz.unsubscribe();
  }
}
