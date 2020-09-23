import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  constructor(
    private pubsub: PubsubService
  ) { }
  sidebar: Subscription;

  dashboardSidebar = dashboardSidebar();
  showSidebar = true;
  ngOnInit() {
    this.sidebar = this.pubsub.$sub(SIDEBAR, (show)=>{
      this.showSidebar = show;
    })
  }

  ngOnDestroy() {
    this.sidebar.unsubscribe();
  }

}
