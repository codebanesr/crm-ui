import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Router } from "@angular/router";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { HEADER_FILTERS } from "src/global.constants";
import { ICampaign } from "../campaign/campaign.interface";
import { CampaignService } from "../home/campaign.service";
import { User } from "../home/interfaces/user";
import { LeadsService } from "../home/leads.service";
import { UsersService } from "../home/users.service";
import { PubsubService } from "../pubsub.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    private leadService: LeadsService,
    private router: Router,
    private campaignService: CampaignService,
    private pubsub: PubsubService
  ) {}

  total = 1;
  listOfRandomUser: User[] = [];
  loading = false;
  pageSize = 20;
  pageIndex = 0;
  startDate = null;
  endDate = null;
  filterGender = [
    { text: "male", value: "male" },
    { text: "female", value: "female" },
  ];

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    filter: Array<{ key: string; value: string[] }>,
    sortField?: string,
    sortOrder?: string,
  ) {
    this.loading = true;
    this.usersService
      .getUsers(pageIndex, pageSize, sortField, sortOrder, filter)
      .subscribe(
        (result: any) => {
          this.total = result.total;
          this.listOfRandomUser = result.users;
        },   
        err=> {}, 
        ()=> this.loading = false
      ) 
  }

  editUser(userid: string) {
    this.router.navigate(["home", "users", "signup"], { queryParams: { userid } });
  }

  onQueryParamsChange(paginator: PageEvent): void {
    this.pageIndex = paginator.pageIndex;
    this.pageSize = paginator.pageSize;
    this.loadDataFromServer(this.pageIndex, this.pageSize, [])
  }

  managers: any;
  selectedCampaign: ICampaign;
  ngOnInit() {
    this.loadDataFromServer(this.pageIndex, this.pageSize, []);
    this.usersService.getManagersForReassignment().subscribe(
      (data) => {
        this.managers = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.populateCampaignDropdown("");
  }


  ionViewWillEnter() {
    this.pubsub.$pub(HEADER_FILTERS, [{
      iconName: 'add',
      onIconClick: () => {
        this.router.navigate(["home", "users", "signup"])
      }
    }]);
  }

  campaignList: ICampaign[];
  async populateCampaignDropdown(hint: string) {
    this.campaignList = await this.campaignService.populateCampaignDropdown();
    console.log(this.campaignList);
  }

  onSelectionChange() {
    this.viewActivity(this.selectedUser);
  }

  takeActions(action) {
    console.log(action);
  }

  reassignToUser(newManager, user) {
    this.usersService.assignManager(newManager, user).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showActivityDrawer: boolean = false;
  userLeadActivityDetails = [];
  selectedUser: User;
  viewActivity(user: User) {
    this.selectedUser = user;
    this.leadService
      .getFollowUps({
        page: 1,
        perPage: 100,
        campaignId: this.selectedCampaign?._id,
        interval: [this.startDate, this.endDate],
        userEmail: this.selectedUser.email,
      })
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
    this.usersService.getUsersLeadLogs(this.selectedUser.email).subscribe(
      (res: any[]) => {
        user.userLeadActivityDetails = res;
      },
      (error) => {
        console.log(error);
      }
    );
    this.showActivityDrawer = true;
  }

  closeActivityDrawer() {
    this.showActivityDrawer = false;
  }
}
