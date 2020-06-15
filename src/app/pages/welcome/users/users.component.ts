import { Component, OnInit } from '@angular/core';
import { routePoints } from 'src/menus/routes';
import { User } from '../../../../interfaces/user';
import { UsersService } from 'src/app/service/users.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private usersService: UsersService) { }

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
      this.usersService.getUsers(pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
        this.loading = false;
        this.total = 200; // mock the total data here
        this.listOfRandomUser = data.results;
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

    ngOnInit(): void {
      this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
    }

}
