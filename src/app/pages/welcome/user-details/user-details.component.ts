import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsersService
  ) { }

  userDetails: any[];
  filters = {};
  startDate: any;
  endDate: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const { email } = params;
      this.userService.getUsersLeadActivity(email, this.filters).subscribe((details: any) => {
        this.userDetails = details;
      })
    });
  }

  onStartDateChange(event) {
    this.filters["startDate"] = event;
  }

  onEndDateChange(event) {
    this.filters["endDate"] = event;
  }

  clearAll() {
    this.filters = {};
  }

  applyFilters() {
    const { email } = this.activatedRoute.snapshot.params;
    this.userService.getUsersLeadActivity(email, this.filters).subscribe((details: any) => {
      this.userDetails = details;
    })
  }
}
