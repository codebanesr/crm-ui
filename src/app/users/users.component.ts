import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { User } from '../home/interfaces/user';
import { LeadsService } from '../home/leads.service';
import { UsersService } from '../home/users.service';
import { PubsubService } from '../pubsub.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  constructor(
    private pubsub: PubsubService,
    private leadService: LeadsService,
    private usersService: UsersService,
    private nzContextMenuService: NzContextMenuService,
    private router: Router
  ) { }

  total = 1;
    listOfRandomUser: User[] = [];
    loading = true;
    pageSize = 10;
    pageIndex = 1;
    filterGender = [
      { text: 'male', value: 'male' },
      { text: 'female', value: 'female' }
    ];

    loadDataFromServer(
      pageIndex: number,
      pageSize: number,
      sortField?: string | null,
      sortOrder?: string | null,
      filter?: Array<{ key: string; value: string[] }>
    ): void {
      this.loading = true;
      this.usersService.getUsers(pageIndex, pageSize, sortField, sortOrder, filter).subscribe((result: any) => {
        this.loading = false;
        this.total = result.metadata.total;
        this.listOfRandomUser = result.users;
      });
    }

    navigate(userid: string) {
      // users/signup
      this.router.navigate(['home', 'users', 'signup'], {queryParams: {userid}});
    }

    onQueryParamsChange(page: number): void {
      this.pageIndex = page;
      this.loadDataFromServer(this.pageIndex, this.pageSize);
    }

    managers: any;
    ngOnInit(): void {
      this.pubsub.$pub("HEADING", {heading: "Users"});
      this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
      this.usersService.getManagersForReassignment().subscribe(data=>{
        this.managers = data;
      }, error=> {
        console.log(error)
      })
    }


    takeActions(action) {
      console.log(action)
    }

    closeMenu(): void {
      this.nzContextMenuService.close();
    }


    reassignToUser(newManager, user) {
      this.usersService.assignManager(newManager, user).subscribe(result=>{
        console.log(result);
      }, error=> {
        console.log(error);
      })
    }

    viewActivity(data: any) {
      // followUp or upcoming api ____________________________________
      this.leadService.getFollowUps().subscribe(data=>{
        console.log(data);
      }, error=>{
        console.log(error);
      })
      // ______________________________________________________________
      this.leadService.getFollowUps().subscribe(data=>{
        console.log(data);
      }, error=>{
        console.log(error);
      })
      !data.userLeadActivityDetails && this.usersService.getUsersLeadLogs(data.email).subscribe((leadDetails: any[])=>{
        data.userLeadActivityDetails = leadDetails;
      }, error=>{
        console.log(error);
      })
    }
}