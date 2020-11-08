import { Component, OnDestroy, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import dashboardSidebar from 'src/menus/dashboard-sidebar';
import { SIDEBAR } from 'src/string.constants';
import { PubsubService } from './pubsub.service';
import { PushNotificationService } from './push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  objectKeys = Object.keys;

  constructor(
    private pubsub: PubsubService,
    swPush: SwPush,
    pushService: PushNotificationService
  ) {
    if (swPush.isEnabled) {
      swPush
        .requestSubscription({
          serverPublicKey: environment.VAPID_PUBLIC,
        })
        .then((subscription) => {
          pushService.sendSubscriptionToTheServer(subscription).subscribe();
        })
        .catch(console.error);
    }
  }
  sidebar: Subscription;

  dashboardSidebar = dashboardSidebar();
  showSidebar = true;
  ngOnInit() {
    this.sidebar = this.pubsub.$sub(SIDEBAR, (show) => {
      this.showSidebar = show;
    });
  }

  ngOnDestroy() {
    this.sidebar.unsubscribe();
  }
}

// {"publicKey":"","privateKey":"3-qnHIybXgG96FDuSQOyS0Vw6TZ5MGfD9N4h7ko6uU8"}
