import { Component } from '@angular/core';
import dashboardSidebar from 'src/menus/dashboard-sidebar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;
  objectKeys = Object.keys;
  dashboardSidebar = dashboardSidebar()
}
