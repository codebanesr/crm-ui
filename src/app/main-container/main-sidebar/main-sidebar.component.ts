import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Router } from "@angular/router";
import { MenuController } from "@ionic/angular";
import { AuthenticationService } from "src/authentication.service";
import { CurrentUser } from "../../home/interfaces/global.interfaces";

@Component({
  selector: "app-main-sidebar",
  templateUrl: "./main-sidebar.component.html",
  styleUrls: ["./main-sidebar.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MainSidebarComponent implements OnChanges, OnInit {
  constructor(
    public authService: AuthenticationService,
  ) {}


  ngOnInit() {
    const currentUser: CurrentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(currentUser.roleType === 'admin') {
      this.appitems.push({
        label: "Add User",
        link: "/home/users/signup",
        icon: "person_add_alt_1",
        shortName: 'addUser'
      });
    } else if(currentUser.roleType === 'superAdmin') {
      this.appitems.push({
        label: "Create Organization",
        link: "/home/create-organization",
        icon: "corporate_fare",
        shortName: 'createOrganization'
      });
    }

    if(currentUser.roleType === 'admin' || currentUser.roleType === 'seniorManager' || currentUser.roleType === 'manager') {
      this.appitems.push({
        label: "Create Campaign",
        link: "/home/campaigns/create",
        icon: "playlist_add",
        shortName: 'createCampaign'
      });

      this.appitems.push({
        label: "All Users",
        link: "/home/users",
        shortName: 'listUsers',
        icon: "supervisor_account",
      });
    }

    this.appitems.push({
      label: 'Logout',
      icon: 'logout',
      onSelected: () => this.authService.logout()
    })
  }

  ngOnChanges(change: SimpleChanges) {
    console.log(change);
  }

  appitems: any = [
    {
      label: "Transactions",
      link: "/home/transactions",
      shortName: 'transactions',
      icon: "card_membership",
    },
    
    {
      label: "Leads",
      link: "/home",
      shortName: 'listLeads',
      icon: "person_search",
    },
    {
      label: "List Campaigns",
      link: "/home/campaign/list",
      icon: "format_list_bulleted",
      shortName: 'listCampaigns'
    },
    {
      label: "Followup",
      link: "/home/followup",
      icon: "pending_actions",
      shortName: 'listFollowUps'
    },
    {
      label: "Reports",
      icon: 'reports',
      items: [
        {
          label: "Campaign Reports",
          link: "/reports/campaignReports",
          icon: "phonelink",
          shortName: 'campaignReports'
        },
        {
          label: "Track Users",
          link: "/reports/tracker",
          icon: "timeline",
          shortName: 'trackUsers'
        },
        {
          label: "Tele Reports",
          link: "/reports/graphs",
          icon: "phonelink",
          shortName: 'teleReports'
        }
      ]
    },
  ];

  config = {
    paddingAtStart: false,
    interfaceWithRoute: true,
    classname: 'my-custom-class',
    // listBackgroundColor: `#673ab7`,
    // fontColor: `#FFF`,
    // backgroundColor: `#673ab7`,
    selectedListFontColor: `#673ab7`,
    highlightOnSelect: true,
    collapseOnSelect: true,
    useDividers: false,
    rtlLayout: true
  };

  selectedItem(ev) {
    console.log(ev);
  }

  menuIsReady(ev) {}

  selectedLabel(ev) {

  }
}
