import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/authentication.service';
import { CurrentUser } from '../../home/interfaces/global.interfaces';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MainSidebarComponent implements OnChanges {

  @Input() appPages: any[] = [];
  @Input() currentUser: CurrentUser;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private menuController: MenuController,
  ) { }

  ngOnChanges(change: SimpleChanges) {
    this.currentUser = change.currentUser?.currentValue;
    this.appPages = change.appPages?.currentValue;

    this.appPages = this.appPages?.filter(page => {
      switch(this.currentUser?.roleType) {
        case 'superAdmin':
          return true;
        case 'admin':
          if(['createOrganization'].includes(page.shortName)) {
            return false;
          }
          return true;
        case 'frontline':
          if(['addUser', 'createCampaign', 'trackUsers', 'teleReports', 'createOrganization'].includes(page.shortName)) {
            return false;
          }
          return true;
      }
    })
  }


  logout() {
    this.authService.logout();
  }

  routeTo(url: string) {
    let routeArray = url.split("/");
    this.router.navigate(routeArray);
    this.menuController.close();
  }
}
