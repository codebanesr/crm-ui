import { Component, OnInit } from '@angular/core';
import { routePoints } from 'src/menus/routes';
import { User } from '../../../../interfaces/user';
import { UsersService } from 'src/app/service/users.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { Router } from '@angular/router';
import { LeadsService } from 'src/app/leads.service';
import { CampaignService } from '../campaign.service';
import { ICampaign } from '../campaign/campaign.interface';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    private leadService: LeadsService,
    private nzContextMenuService: NzContextMenuService,
    private router: Router,
    private campaignService: CampaignService
  ) {}

  total = 1;
  listOfRandomUser: User[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  selectedInterval = null;
  filterGender = [
    { text: 'male', value: 'male' },
    { text: 'female', value: 'female' },
  ];

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.usersService
      .getUsers(pageIndex, pageSize, sortField, sortOrder, filter)
      .subscribe((result: any) => {
        this.loading = false;
        this.total = result.metadata.total;
        this.listOfRandomUser = result.users;
      });
  }

  navigate(userid: string) {
    this.router.navigate(['signup'], { queryParams: { userid } });
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
  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
    this.usersService.getManagersForReassignment().subscribe(
      (data) => {
        this.managers = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.populateCampaignDropdown('');
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

  closeMenu(): void {
    this.nzContextMenuService.close();
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
        campaignName: this.selectedCampaign?.campaignName,
        interval: this.selectedInterval,
        userEmail: this.selectedUser.email,
        page: 1,
        perPage: 100,
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
        this.userLeadActivityDetails = res;
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

  today = new Date();
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };
}
