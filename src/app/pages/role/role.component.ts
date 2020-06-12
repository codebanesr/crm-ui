import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  constructor(
    private roleService: RoleService,
    private router: Router
  ) { }


  roles: any[] = []

  ngOnInit(): void {
    this.roleService.getAllRoles().subscribe((roles: any[]) => {
      this.roles = roles;
    }, error => {
      console.log("An error occured while fetching roles");
    })
  }


  updateRole(changedValue) {
    this.roleService.createOrUpdateRole(changedValue).subscribe(data=>{
      console.log(data);
    }, error=>{
      console.error(error)
    });
  }

  createNewRole() {
    this.router.navigate(['welcome', 'create', 'role']);
  }
}
