import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { ICampaign } from "../campaign/campaign.interface";
import { CampaignService } from "../home/campaign.service";
import { User } from "../home/interfaces/user";
import { LeadsService } from "../home/leads.service";
import { UsersService } from "../home/users.service";

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
    private loadingCtrl: LoadingController
  ) {}

  total = 1;
  listOfRandomUser: User[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  startDate = null;
  endDate = null;
  filterGender = [
    { text: "male", value: "male" },
    { text: "female", value: "female" },
  ];

  async loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): Promise<void> {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      mode: 'md',
      message: 'Fetching lead ...'
    })
    loading.present();
    this.usersService
      .getUsers(pageIndex, pageSize, sortField, sortOrder, filter)
      .subscribe(async (result: any) => {
        await loading.dismiss();
        this.total = result.metadata.total;
        this.listOfRandomUser = result.users;
      }, async err=> loading.dismiss());
  }

  editUser(userid: string) {
    this.router.navigate(["home", "users", "signup"], { queryParams: { userid } });
  }


  createNewUser() {
    this.router.navigate(["home", "users","signup"]);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }

  managers: any;
  selectedCampaign: ICampaign;
  async ngOnInit() {
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
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

  campaignList: ICampaign[];
  async populateCampaignDropdown(hint: string) {
    this.campaignList = await this.campaignService.populateCampaignDropdown(
      hint
    );
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
