import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Leads',
      url: '/home',
      icon: 'mail'
    },
    {
      title: 'Single Lead',
      url: '/home/solo',
      icon: 'paper-plane'
    },
    {
      title: 'All Users',
      url: '/home/users',
      icon: 'trash'
    },
    {
      title: 'Add User',
      url: '/home/users/signup',
      icon: 'heart'
    },
    {
      title: 'List Campaigns',
      url: '/home/campaign/list',
      icon: 'archive'
    },
    {
      title: 'Create Campaign',
      url: '/home/create-campaign',
      icon: 'trash'
    },
    {
      title: 'Create Organization',
      url: '/home/create-organization',
      icon: 'paper-plane'
    },
  ];

  routeTo(url: string) {
    let routeArray = url.split("/");
    this.router.navigate(routeArray);
  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
