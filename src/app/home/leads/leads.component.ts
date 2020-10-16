import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from "ng-zorro-antd/dropdown";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { PubsubService } from "src/app/pubsub.service";
import { CampaignService } from "../campaign.service";
import { ColumnItem, DataItem } from "../interfaces/listOfCols";
import { LeadsService } from "../leads.service";
import { UsersService } from "../users.service";
import { Setting, ILeadColumn } from "./lead.interface";

@Component({
  selector: "app-leads",
  templateUrl: "./leads.component.html",
  styleUrls: ["./leads.component.scss"],
})
export class LeadsComponent implements OnInit {
  setOfCheckedId = new Set<string>();
  constructor(
    private msg: NzMessageService,
    private leadsService: LeadsService,
    private nzContextMenuService: NzContextMenuService,
    private router: Router,
    private fb: FormBuilder,
    private usersService: UsersService,
    private campaignService: CampaignService,
    private pubsub: PubsubService
  ) {}

  page: number = 1;
  perPage: number = 15;
  tagPlaceHolder = 3;

  showCols = [];
  listOfColumns: ColumnItem[];
  listOfOption: any[] = [];

  visible: boolean;
  placement = "right";
  managers = null;
  isTimelineModalVisible = false;

  settingValue!: Setting;
  settingForm: FormGroup;
  indeterminate = false;
  checked = false;
  listOfCurrentPageData: any[] = [];

  ngOnInit() {
    this.pubsub.$pub("HEADING", { heading: "Leads" });
    this.visible = false;
    this.listOfOption = ["LEAD", "TICKET", "USER", "CUSTOMER"];
    this.initSettingForm();
    this.initEmailForm();
    this.rerenderCols();
    this.getAllLeadColumns();
    this.initRightClickActions();
    this.getBasicOverview();
    this.initEtAutocomplete();
    this.populateCampaignDropdown("");
  }

  campaignList: any[];
  async populateCampaignDropdown(hint: string) {
    this.campaignList = await this.campaignService.populateCampaignDropdown(
      hint
    );
    console.log(this.campaignList);
  }

  onItemChecked(id: string, checked: boolean): void {
    console.log(id);
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onAllChecked(checked: boolean): void {
    if (checked)
      this.listOfData.forEach((data: any) =>
        this.setOfCheckedId.add(data.externalId)
      );
    else this.setOfCheckedId = new Set<string>();
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfData.every(({ externalId }) =>
      this.setOfCheckedId.has(externalId)
    );
  }

  usersCount: number;
  initRightClickActions() {
    this.usersService.getUsers(0, 20, "abc", "asc").subscribe(
      (data: any) => {
        this.managers = data.users;
        this.usersCount = data?.metadata?.total;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  listOfData: DataItem[] = [];
  objectkeys = Object.keys;

  // showCols: this.showCols.filter(cols=>cols.checked).map(col=>col.value)
  leadOptions: {
    page: number;
    perPage: number;
    showCols?: string[];
    searchTerm: string;
    filters?: any;
  } = {
    page: this.page || 1,
    perPage: this.perPage || 1,
    searchTerm: "",
    filters: { assigned: true },
  };
  isEmpty: boolean;
  getData() {
    this.leadsService.getLeads(this.leadOptions).subscribe(
      (response: any) => {
        if (response.data.length === 0) {
          this.isEmpty = true;
        } else {
          this.msg.info(`Retrieved ${response.data.length} leads`);
          this.isEmpty = false;
          this.generateListOfCols(response.data[0]);
          this.listOfData = response.data;
          this.total = response.total;
        }
      },
      (error) => {
        this.msg.error("Some error occured while fetching leads");
      }
    );
  }

  typeDict: {
    [key: string]: {
      label: string;
      value: string;
      type: string;
      checked: boolean;
    };
  };
  dataLoaded: boolean = false;
  getAllLeadColumns() {
    this.loading = true;
    this.leadsService
      .getAllLeadColumns(this.settingForm.get("selectedCampaign").value._id)
      .subscribe(
        (mSchema: { paths: ILeadColumn[] }) => {
          this.loading = false;
          mSchema.paths.forEach((path: ILeadColumn) => {
            this.showCols.push({
              label: path.readableField,
              value: path.internalField,
              checked: path.checked,
              type: path.type,
            });
          });

          // for tables
          this.typeDict = Object.assign(
            {},
            ...this.showCols.map((x) => ({ [x.value]: x }))
          );
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  // get the mapper here and change the names, the key value pairs for data elements will not change
  generateListOfCols(row) {
    this.listOfColumns = Object.keys(row).map((key) => {
      return {
        name: key,
      };
    });
  }

  createLead() {
    this.router.navigate(["welcome", "leads", "create"]);
  }

  updateLead(data) {
    this.router.navigate(["welcome", "leads", "create"], {
      queryParams: { id: data.externalId },
    });
  }

  listOfSwitch = [
    // { name: 'Ticket', formControlName: 'ticket' },
    { name: "Lead", formControlName: "lead" },
    { name: "Archived", formControlName: "archived" },
    { name: "Upcoming", formControlName: "upcoming" },
  ];

  filterForm: FormGroup;
  initSettingForm() {
    this.settingForm = this.fb.group({
      lead: [true],
      archived: [false],
      upcoming: [false],
      assigned: [true],
      dateRange: [null],
      selectedCampaign: [""],
    });
    this.settingValue = this.settingForm.value;
    this.settingForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.settingValue = value;
        this.leadOptions.filters = {
          ...this.leadOptions.filters,
          ...this.settingForm.value,
        };
        this.getData();
      });
  }

  rerenderCols() {
    this.leadOptions.showCols = this.showCols
      .filter((col) => col.checked)
      .map((col) => col.value);

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
    this.leadsService.getHistoryForLead(externalId).subscribe(
      (selectedLeadHistory) => {
        this.selectedLeadHistory = selectedLeadHistory;
        this.isTimelineModalVisible = true;
      },
      (error) => {
        this.selectedLeadHistory = undefined;
        this.msg.error(error.message + " : " + lead.externalId);
      }
    );
  }

  isVisible = false;
  showEmailModal(leadData): void {
    this.isVisible = true;
    this.selectedLead = leadData;
  }

  handleOk(): void {
    console.log("Button ok clicked!");
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  reassignLead(newManager: any) {
    console.log(this.selectedLead, newManager);
    this.leadsService
      .reassignLead(
        this.selectedLead.email,
        newManager.email,
        this.selectedLead
      )
      .subscribe(
        (result) => {
          this.msg.success("Successfully reassigned lead");
        },
        (error) => {
          this.msg.error(error.error);
        }
      );
  }

  selectedLead: any;
  isReassignmentModalVisible;
  selectedManager: FormControl;
  openReassignModal(leadData, bulkReassign: boolean = false) {
    this.selectedLead = leadData;
    this.selectedManager = new FormControl(null);
    this.selectedManager.valueChanges.subscribe((data) => {
      console.log(data);
    });
    this.isReassignmentModalVisible = true;
    // now show managers on modal, wait for a manager to click and send for reassignment also set the typings file now, its required
  }

  handleReassignmentCancel() {
    this.isReassignmentModalVisible = false;
  }

  handleTimelineClose() {
    this.isTimelineModalVisible = false;
  }

  handleReassignmentSubmit() {}

  total: number = 1000;
  loading = false;
  onQueryParamsChange(page: number): void {
    this.leadOptions.page = page;
    this.getData();
  }

  basicOverview: any;
  getBasicOverview() {
    this.leadsService.getBasicOverview().subscribe(
      (basicOverview) => {
        this.basicOverview = basicOverview;
      },
      (error) => {
        console.log(error.messsage);
      }
    );
  }

  selectedEmailTemplate: any;
  populateEmailModal(event) {
    console.log(typeof event, event.nzValue);
    this.selectedEmailTemplate = event.nzValue;

    this.attachments = this.selectedEmailTemplate.attachments;
    this.emailForm.patchValue({
      subject: this.selectedEmailTemplate.subject,
      content: this.selectedEmailTemplate.content,
    });
  }

  emailTemplates: any;
  etFormControl = new FormControl([null]);
  attachments: any[] = [];
  initEtAutocomplete() {
    this.etFormControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.campaignService
          .getAllEmailTemplates({ searchTerm })
          .subscribe((emailTemplates: any) => {
            this.emailTemplates = emailTemplates;
          });
      });
  }

  emailForm: FormGroup;
  emailModel;
  initEmailForm() {
    this.emailForm = this.fb.group({
      subject: [null],
      content: [null],
      attachments: [null],
    });
  }

  submitEmailForm(model) {
    console.log(model);
  }
}
