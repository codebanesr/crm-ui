import { Component, OnInit } from '@angular/core';
import { ColumnItem, listOfColumns, DataItem } from './listOfCols';
import { TicketsService } from 'src/app/tickets.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  constructor(
    private msg: NzMessageService,
    private ticketsService: TicketsService,
    private router: Router,
  ) {}

  listOfColumns: ColumnItem[]
  ngOnInit() {
    this.listOfColumns = listOfColumns;
    this.generateData();

  }

  listOfData: DataItem[] = [];
  page: number = 1;
  perPage: number = 15;

  generateData() {
    this.ticketsService.getAllTickets(this.page, this.perPage).subscribe((response: any) => {
      this.msg.info("Retrieved some leads");
      response.forEach((row: any) => {
        this.listOfData.push({
          _id: row._id,
          name: row.customer.name,
          email: row.customer.email,
          phoneNumber: row.customer.phoneNumber,
          assignedTo: row.assignedTo,
          description: row.changeHistory.changeType,
          createdAt: row.createdAt
        });
      })
    }, error => {
      this.msg.error("Some error occured while fetching leads");
    });
  }


  trackByName(_: number, item: ColumnItem): string {
    return item.name;
  }

  sortByAge(): void {
    this.listOfColumns.forEach(item => {
      if (item.name === 'Age') {
        item.sortOrder = 'descend';
      } else {
        item.sortOrder = null;
      }
    });
  }

  resetFilters(): void {
    this.listOfColumns.forEach(item => {
      if (item.name === 'Name') {
        item.listOfFilter = [
          { text: 'Joe', value: 'Joe' },
          { text: 'Jim', value: 'Jim' }
        ];
      } else if (item.name === 'Address') {
        item.listOfFilter = [
          { text: 'London', value: 'London' },
          { text: 'Sidney', value: 'Sidney' }
        ];
      }
    });
  }


  createLead() {
    this.router.navigate(['welcome', "ticket", "create"]);
  }

  resetSortAndFilters(): void {
    this.listOfColumns.forEach(item => {
      item.sortOrder = null;
    });
    this.resetFilters();
  }


  onPageIndexChange(page: number) {
    this.page = page;
    this.generateData();
  }

  onPageSizeChange(perPage: number){
    this.perPage = perPage;
    this.generateData();
  }



  updateTicket(data) {
    console.log(data)
    this.router.navigate(['welcome', "ticket", "create"], { queryParams: { id: data._id } });
  }
}
