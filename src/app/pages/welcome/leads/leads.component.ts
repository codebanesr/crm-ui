import { Component, OnInit } from '@angular/core';
import { LeadsService } from 'src/app/leads.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ColumnItem, listOfColumns, DataItem } from './listOfCols';


@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit{
  constructor(private msg: NzMessageService, private leadsService: LeadsService) {

  }

  page: number = 1;
  perPage: number = 15;

  listOfColumns: ColumnItem[]
  ngOnInit() {
    this.listOfColumns = listOfColumns;
    this.generateData();
  }

  listOfData: DataItem[] = [];

  generateData() {
    this.leadsService.getLeads(1, 20, "sortField", "sortOrder").subscribe((response: any)=>{
      this.msg.info("Retrieved some leads");
      response.forEach((row: any)=>{
        this.listOfData.push({
          name: row.customer.name,
          email: row.customer.email,
          phonenumber: row.customer.phoneNumber,
          amount: row.amount,
          followUpDate: row.followUpDate,
          description: row.notes[0].content,
        });
      })
    }, error=>{
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
}











