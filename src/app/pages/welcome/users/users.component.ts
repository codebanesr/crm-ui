import { Component, OnInit } from '@angular/core';
import { routePoints } from 'src/menus/routes';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor() { }

  createUser: String;
  ngOnInit(): void {
    this.createUser = `/welcome/${routePoints.USER_CREATE}`;
  }

}
