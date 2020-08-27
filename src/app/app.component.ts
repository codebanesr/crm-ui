import { Component } from '@angular/core';
import dashboardSidebar from 'src/menus/dashboard-sidebar';
import { routePoints } from 'src/menus/routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  permissions = Object.values(routePoints)
  isCollapsed = false;
  objectKeys = Object.keys;
  dashboardSidebar = dashboardSidebar()
}
