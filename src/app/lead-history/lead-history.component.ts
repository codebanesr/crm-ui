import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, MenuController, ModalController } from "@ionic/angular";
import { CampaignService } from '../home/campaign.service';
import { ILeadHistory } from "../home/lead-solo/lead-history.interface";
import { LeadsService } from "../home/leads.service";
import { UsersService } from '../home/users.service';
import { IHistory } from "./history.interface";

@Component({
  selector: "app-lead-history",
  templateUrl: "./lead-history.component.html",
  styleUrls: ["./lead-history.component.scss"],
})
export class LeadHistoryComponent implements OnInit {
  constructor(
    private leadService: LeadsService,
    public modalController: ModalController,
    private router: Router,
    private menu: MenuController,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UsersService,
    private loadingCtrl: LoadingController,
    private activatedRoute: ActivatedRoute
  ) {}

  transactions: IHistory[] = [];
  pagination = { sortBy: "updatedAt", sortOrder: "ASC", page: 1, perPage: 20 };
  
  histories: any[] = [];
  objectKeys = Object.keys;

  listOfCampaigns: any;
  listOfHandlers: any;

  ngOnInit() {
    this.initTransactionFilters();
    this.getTransactions();
    this.initCampaignList();
    this.initHandlerList();
    this.checkForQueryParams();
  }


  checkForQueryParams() {
    this.leadId.setValue(this.activatedRoute.snapshot.queryParams.leadId);
  }

  downloadTransactions() {
    this.leadService.downloadAllTransactions(this.pagination, this.transactionForm?.value);
  }  

  initCampaignList() {
    this.campaignService.getCampaigns(1, 20, {}, '', '').subscribe((result: any) =>{
      this.listOfCampaigns = result.data;
    })
  }

  transactionForm: FormGroup;
  handlerFilter = new FormControl();
  startDate = new FormControl();
  endDate = new FormControl();
  prospectName = new FormControl();
  handler = new FormControl([]);
  campaign = new FormControl();
  leadId = new FormControl(null);
  initTransactionFilters() {
    this.transactionForm = this.fb.group({
      startDate: this.startDate,
      endDate: this.endDate,
      prospectName: this.prospectName,
      handler: this.handler,
      campaign: this.campaign,
      leadId: this.leadId
    });
  }

  tempUserList: any;
  async initHandlerList() {
    this.userService.getAllUsersHack().subscribe((result: any)=>{
      this.tempUserList = result[0].users;
      this.listOfHandlers = result[0].users;
    });

    this.handlerFilter.valueChanges.subscribe((value: string) => {
      this.listOfHandlers = this.tempUserList.filter((v)=>{
        // search in both email and name
        const t = v.fullName + v.email;
        return t.includes(value)
      });
    })
  }


  total = 50;
  async getTransactions() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      mode: 'md',
      message: 'Loading transactions ...'
    });

    await loading.present();
    this.leadService
      .getTransactions(this.pagination, this.transactionForm?.value)
      .subscribe(({response, total} : {response: IHistory[], total: number}) => {
        loading.dismiss();
        this.transactions = response;
        this.total = total;
      }, error => {
        loading.dismiss();
      });
  }

  async showLead(leadId: string, campaignId: string) {
    this.router.navigate(["home", "solo"], {
      queryParams: {
        leadId,
        campaignId,
      },
    });
  }

  callType: {
    1: "Incoming",
    2: "Outgoing"
  }

  showFiller = false;
  keysToDisplay = ['createdAt', 'leadStatus', 'followUp', 'notes', 'prospectName', 'nextAction', 'duration', 'type', 'newUser']
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
    nextAction: "Next Action",
    requestedInformation: "Information Requested",
    organization: "Organization",
    duration: "Call Duration",
    type: "Call Band",
    number: "Phone Number",
  };

  perPage = 20;
  handlePageChange(paginator: PageEvent) {
    this.pagination.page = paginator.pageIndex + 1;
    this.pagination.perPage = this.perPage;
    this.getTransactions();
  }

  openTransactionFilter() {
    this.menu.enable(true, 'transactionFilter')
    this.menu.open('transactionFilter');
  }
}



