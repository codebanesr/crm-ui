import { Component, OnInit } from '@angular/core';
import { routePoints } from 'src/menus/routes';
import { User } from '../../../../interfaces/user';
import { UsersService } from 'src/app/service/users.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private usersService: UsersService, private nzContextMenuService: NzContextMenuService) { }

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
      sortField: string | null,
      sortOrder: string | null,
      filter: Array<{ key: string; value: string[] }>
    ): void {
      this.loading = true;
      this.usersService.getUsers(pageIndex, pageSize, sortField, sortOrder, filter).subscribe((data: any) => {
        this.loading = false;
        this.total = 200; // mock the total data here
        this.listOfRandomUser = data;
      });
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
      console.log(params);
      const { pageSize, pageIndex, sort, filter } = params;
      const currentSort = sort.find(item => item.value !== null);
      const sortField = (currentSort && currentSort.key) || null;
      const sortOrder = (currentSort && currentSort.value) || null;
      this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
    }

    managers: any;
    ngOnInit(): void {
      this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
      this.usersService.getManagersForReassignment("manager").subscribe(data=>{
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
}
