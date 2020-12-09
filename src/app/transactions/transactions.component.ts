import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from "@angular/router";
import { MenuController, ModalController } from "@ionic/angular";
import { CampaignService } from '../home/campaign.service';
import { LeadsService } from "../home/leads.service";
import { UsersService } from '../home/users.service';

interface IHistory {
  oldUser: string;
  newUser: string;
  lead: string;
  campaignName: string;
  prospectName: string;
  phoneNumber: string;
  followUp: String;
  direction: String;
  notes: string;
  callRecordUrl: string;
  geoLocation: { coordinates: string[] };
  leadStatus: string;
  attachment: string;
  requestedInformation?: { [key: string]: string }[];
  active: boolean;
  createdAt: string;
  nextAction?: string;
}
@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.scss"],
})
export class TransactionsComponent implements OnInit {
  constructor(
    private leadService: LeadsService,
    public modalController: ModalController,
    private router: Router,
    private menu: MenuController,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UsersService
  ) {}

  transactions: IHistory[] = [];
  pagination = { sortBy: "createdAt", sortOrder: "ASC", page: 1, perPage: 20 };
  filters = {};
  histories: any[] = [];
  objectKeys = Object.keys;

  listOfCampaigns: any;
  listOfHandlers: any;
  transactionForm: FormGroup;
  handlerFilter = new FormControl();
  startDate = new FormControl();
  endDate = new FormControl();
  prospectName = new FormControl();
  handler = new FormControl();
  campaign = new FormControl()

  ngOnInit() {
    this.getTransactions();
    this.initTransactionFilters();
    this.initCampaignList();
    this.initHandlerList();
  }

  initCampaignList() {
    this.campaignService.getCampaigns(1, 20, {}, '', '').subscribe((result: any) =>{
      this.listOfCampaigns = result.data;
    })
  }

  tempUserList: any;
  initHandlerList() {
    this.userService.getAllUsersHack().subscribe((result: any)=>{
      this.tempUserList = result[0].users;
      this.listOfHandlers = result[0].users;
      console.log(this.tempUserList)
    });

    this.handlerFilter.valueChanges.subscribe((value: string) => {
      this.listOfHandlers = this.tempUserList.filter((v)=>{
        // search in both email and name
        const t = v.fullName + v.email;
        return t.includes(value)
      });
    })
  }

  initTransactionFilters() {
    this.transactionForm = this.fb.group({
      startDate: this.startDate,
      endDate: this.endDate,
      prospectName: this.prospectName,
      handler: this.handler,
      campaign: this.campaign
    })
  }


  getTransactions() {
    this.leadService
      .getTransactions(this.pagination, this.filters)
      .subscribe((histories: IHistory[]) => {
        this.transactions = histories;
      });
  }

  async showLead(leadId: string) {
    this.router.navigate(["home", "solo"], {
      queryParams: {
        leadId,
        campaignId: "5f89dd4c3d90afc740368088",
      },
    });
  }

  showFiller = false;
  leadMapping = {
    geoLocation: "Location",
    createdAt: "Created At",
    _id: "Transaction Id",
    lead: "Lead Id",
    notes: "Notes",
    newUser: "Assigned To",
    prospectName: "Name",
    leadStatus: "Status",
    followUp: "Scheduled",
    nextAction: "Action",
    requestedInformation: "Information Requested",
    organization: "Organization"
  };

  perPage = 15;
  handlePageChange(paginator: PageEvent) {
    this.pagination.page = paginator.pageIndex;
    this.pagination.perPage = this.perPage;
    this.getTransactions();
  }

  openTransactionFilter() {
    this.menu.enable(true, 'transactionFilter')
    this.menu.open('transactionFilter');
  }

  onTransactionFilterSubmit() {
    console.log(this.transactionForm.value);
  }

}



