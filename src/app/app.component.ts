import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscribable, Subscription } from 'rxjs';
import dashboardSidebar from 'src/menus/dashboard-sidebar';
import { SIDEBAR } from 'src/string.constants';
import { PubsubService } from './pubsub.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  isCollapsed = false;
  objectKeys = Object.keys;

  constructor() { }
  sidebar: Subscription;
  dashboardSidebar = dashboardSidebar();
  ngOnInit() {
  }

  ngOnDestroy() {
    this.sidebar.unsubscribe();
  }

}
