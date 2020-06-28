import { Component, OnInit } from '@angular/core';
import { LeadsService } from 'src/app/leads.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ColumnItem, listOfColumns, DataItem } from './listOfCols';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ILeadColumn, Setting } from './lead.interface';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { UsersService } from 'src/app/service/users.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit{
  constructor(
    private msg: NzMessageService,
    private leadsService: LeadsService,
    private nzContextMenuService: NzContextMenuService,
    private router: Router,
    private fb: FormBuilder,
    private usersService: UsersService
  ) {}

  page: number = 1;
  perPage: number = 15;
  tagPlaceHolder = 3

  showCols = [];
  listOfColumns: ColumnItem[]
  listOfOption: any[] = []
  visible: boolean;
  placement = "right";
  managers: any;
  isTimelineModalVisible = false;


  settingValue!: Setting;
  settingForm: FormGroup;
  ngOnInit() {
    this.visible = false;
    this.listOfOption = ["LEAD", "TICKET", "USER", "CUSTOMER"];
    this.initSettingForm();
    this.rerenderCols();
    this.getAllLeadColumns();
    this.initRightClickActions();
  }


  initRightClickActions() {
    this.usersService.getUsers(0, 20, "abc", "asc").subscribe(data=>{
      this.managers = data;
    }, error=> {
      console.log(error)
    })
  }

  listOfData: DataItem[] = [];
  objectkeys = Object.keys


  // showCols: this.showCols.filter(cols=>cols.checked).map(col=>col.value)
  leadOptions: { page: number, perPage: number, showCols?: string[], searchTerm: string, filters?: any } = { page: this.page || 1, perPage: this.perPage || 1, searchTerm: "", filters: { assigned: true } };
  getData() {
    this.leadsService.getLeads(this.leadOptions).subscribe((response: any)=>{
      this.msg.info("Retrieved some leads");
      this.generateListOfCols(response[0]);
      this.listOfData = response;
    }, error=>{
      this.msg.error("Some error occured while fetching leads");
    });
  }

  typeDict: { [key: string]: { label: string, value: string, type: string, checked: boolean } };
  dataLoaded: boolean = false;
  getAllLeadColumns() {
    this.loading = true;
    this.leadsService.getAllLeadColumns().subscribe((mSchema: { paths: ILeadColumn[] }) => {
      this.loading = false;
      mSchema.paths.forEach((path: ILeadColumn) => {
        this.showCols.push({
          label: path.readableField,
          value: path.internalField,
          checked: path.checked,
          type: path.type
        })
      });

      // for tables
      this.typeDict = Object.assign({}, ...this.showCols.map((x) => ({ [x.value]: x })));
    }, error => {
      this.loading = false;
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


  listOfSwitch = [
    { name: 'Ticket', formControlName: 'ticket' },
    { name: 'Lead', formControlName: 'lead' },
    { name: 'Archived', formControlName: 'archived' },
    { name: 'Assigned', formControlName: 'assigned' },
  ];

  filterForm: FormGroup
  initSettingForm() {
    this.settingForm = this.fb.group({
      ticket: [false],
      lead: [true],
      archived: [false],
      assigned: [true],
      handlerEmail: [null],
      dateRange: [null],
      moduleTypes: []
    });
    this.settingValue = this.settingForm.value;
    this.settingForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        this.settingValue = value;
        this.leadOptions.filters = { ...this.leadOptions.filters, ...this.settingForm.value };
        this.getData();
      });
  }

  rerenderCols() {
    this.leadOptions.showCols = this.showCols.filter(col => col.checked).map(col => col.value);

    this.getData();
  }

  onPageIndexChange(page: number) {
    this.page = page;
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


  selectedLeadHistory: any;
  showLeadHistory(lead) {
    let externalId = lead?.externalId;
    this.selectedLead = lead;
    this.leadsService.getHistoryForLead(externalId).subscribe(selectedLeadHistory => {
      this.selectedLeadHistory = selectedLeadHistory;
      this.isTimelineModalVisible = true;
    }, error => {
      this.selectedLeadHistory = undefined;
      this.msg.error(error.message + " : " + lead.externalId);
    });
  }


  isVisible = false;
  showEmailModal(customerData): void {
    console.log(customerData)
    this.initEmailForm();
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }


  emailForm: FormGroup;
  emailModel;
  emailFields: FormlyFieldConfig[];
  initEmailForm() {
    this.emailForm = this.fb.group({
      subject: [null],
      text: [null],
      attachments: [null]
    });
  }

  submitEmailForm(model) {
    console.log(model);
  }


  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }


  reassignLead(newManager: any) {
    console.log(this.selectedLead, newManager);
    this.leadsService.reassignLead(this.selectedLead.email, newManager.email, this.selectedLead).subscribe(result => {
      this.msg.success("Successfully reassigned lead");
    }, error => {
      this.msg.error(error.error);
    })
  }


  selectedLead: any;
  isReassignmentModalVisible;
  selectedManager: FormControl;
  openReassignModal(leadData) {
    this.selectedLead = leadData;
    this.selectedManager = new FormControl(null);
    this.selectedManager.valueChanges.subscribe(data => {
      console.log(data);
    })
    this.isReassignmentModalVisible = true;
    // now show managers on modal, wait for a manager to click and send for reassignment also set the typings file now, its required
  }


  handleReassignmentCancel() {
    this.isReassignmentModalVisible = false;
  }

  handleTimelineClose() {
    this.isTimelineModalVisible = false;
  }

  handleReassignmentSubmit() {

  }


  total: number = 1000;
  loading = false;
  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;



    this.leadOptions.perPage = pageSize;
    this.leadOptions.page = pageIndex;
    this.getData();
  }
}











