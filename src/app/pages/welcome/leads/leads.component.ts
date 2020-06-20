import { Component, OnInit } from '@angular/core';
import { LeadsService } from 'src/app/leads.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ColumnItem, listOfColumns, DataItem } from './listOfCols';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ILeadColumn } from './lead.interface';


@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit{
  constructor(
    private msg: NzMessageService,
    private leadsService: LeadsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  page: number = 1;
  perPage: number = 15;
  tagPlaceHolder = 3

  showCols = [];
  listOfColumns: ColumnItem[]
  listOfOption: any[] = []
  visible: boolean;
  placement = "right";
  ngOnInit() {
    this.visible = false;
    this.listOfOption = ["LEAD", "TICKET", "USER", "CUSTOMER"];
    this.initFilterForm();
    this.rerenderCols();
    this.getAllLeadColumns();
  }

  listOfData: DataItem[] = [];
  objectkeys = Object.keys


  // showCols: this.showCols.filter(cols=>cols.checked).map(col=>col.value)
  leadOptions: { page: number, perPage: number, showCols?: string[], searchTerm: string } = { page: this.page || 1, perPage: this.perPage || 1, searchTerm: "" };
  getData() {
    this.leadsService.getLeads(this.leadOptions).subscribe((response: any)=>{
      this.msg.info("Retrieved some leads");
      this.generateListOfCols(response[0]);
      this.listOfData = response;
    }, error=>{
      this.msg.error("Some error occured while fetching leads");
    });
  }

  typeDict: {[key: string]: {label: string, value: string, type: string, checked: boolean}};
  dataLoaded: boolean = false;
  getAllLeadColumns() {
    this.leadsService.getAllLeadColumns().subscribe((mSchema: {paths: ILeadColumn[]})=>{
      mSchema.paths.forEach((path: ILeadColumn)=>{
        this.showCols.push({
          label: path.readableField,
          value: path.internalField,
          checked: path.checked,
          type: path.type
        })
      });

      // for tables
      this.typeDict = Object.assign({}, ...this.showCols.map((x) => ({[x.value]: x})));
    })
  }

  // get the mapper here and change the names, the key value pairs for data elements will not change
  generateListOfCols(row) {
    this.listOfColumns = Object.keys(row).map(key=>{
      return {
        name: key
      }
    })
  }

  createLead() {
    this.router.navigate(['welcome', 'leads', 'create']);
  }


  filterForm: FormGroup
  initFilterForm() {
    this.filterForm = this.fb.group({
      handlerEmail: [null],
      dateRange: [null],
      moduleTypes: []
    });
  }
  submitForm() {
    console.log(this.filterForm.value);
  }

  rerenderCols() {
    this.leadOptions.showCols = this.showCols.filter(col=>col.checked).map(col=>col.value);

    this.getData();
  }

  onPageIndexChange(page: number) {
    this.page = page;
    this.getData();
  }

  onPageSizeChange(perPage: number){
    this.perPage = perPage;
    this.getData();
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  handleSearchTerm() {
    this.getData();
  }



  takeActions(event) {
    console.log(event);
  }
}











