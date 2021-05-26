import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatSidenav } from "@angular/material/sidenav";
import * as moment from "moment";
import { ICampaign } from "src/app/campaign/campaign.interface";
import { CampaignService } from "src/app/home/campaign.service";
import { UsersService } from "src/app/home/users.service";
import { PubsubService } from "src/app/pubsub.service";
import { HEADER_FILTERS } from "src/global.constants";
import { GraphService } from "../graphs/graphs.service";
import { TelecallerLcTableItem } from "../telecaller-lc-table/telecallerLc.interface";

@Component({
  selector: "app-campaign-report-container",
  templateUrl: "./campaign-report-container.component.html",
  styleUrls: ["./campaign-report-container.component.scss"],
})
export class CampaignReportContainerComponent implements AfterViewInit, OnInit {
  constructor(
    private graphService: GraphService,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UsersService,
    private pubsub: PubsubService
  ) {}

  stackBarTitle = "Disposition Wise Lead Count / Campaign";
  XAxisLabel = "Campaign Name";
  YAxisLabel = "Total Leads";
  stackBarData = null;
  max = 50;

  barData: any[];
  listOfCampaigns: ICampaign[] = [];
  telecallerLCData: TelecallerLcTableItem[] = [];

  // talktimeData = null;
  // averageTalktimeData = null;
  ngOnInit() {
    this.initFilterForm();
    this.initHandlerList();
    this.initCampaignList();
  }

  @ViewChild("drawer") drawer: MatSidenav;
  ionViewWillEnter() {
    this.pubsub.$pub(HEADER_FILTERS, [
      {
        iconName: "filter_alt",
        onIconClick: () => {
          this.drawer.toggle();
        },
      },
      // {
      //   iconName: 'download',
      //   onIconClick: () => {
      //     this.downloadTransactions();
      //   }
      // }
    ]);
  }

  ngAfterViewInit() {}

  fetchAllAnalyticsData() {
    this.graphService
      .campaignWiseLeadCount(this.filterForm.value)
      .subscribe((data) => {
        this.barData = data;
      });

    this.graphService
      .campaignWiseLeadCountPerCategory(this.filterForm.value)
      .subscribe((data) => {
        this.XAxisLabel = data.XAxisLabel;
        this.YAxisLabel = data.YAxisLabel;

        this.max = data.max;
        this.stackBarData = data.stackBarData;
      });

    this.graphService
      .getOpenClosedLeadCount(this.filterForm.value)
      .subscribe((data) => {
        this.telecallerLCData = data.items;
      });
  }

  async initCampaignList() {
    this.listOfCampaigns = await this.campaignService.populateCampaignDropdown({
      select: ["_id", "campaignName"],
    });

    this.campaign.setValue([this.listOfCampaigns[0]._id]);
    this.fetchAllAnalyticsData();
  }

  listOfHandlers: any;
  tempUserList: any;
  async initHandlerList() {
    this.userService.getAllUsersHack().subscribe((result: any) => {
      this.tempUserList = result[0].users;
      this.listOfHandlers = result[0].users;
    });

    this.handlerFilter.valueChanges.subscribe((value: string) => {
      this.listOfHandlers = this.tempUserList.filter((v) => {
        // search in both email and name
        const t = v.fullName + v.email;
        return t.includes(value);
      });
    });
  }

  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();
  startDate = new FormControl(new Date(this.year, this.month - 2, 1));
  endDate = new FormControl(new Date(this.year, this.month, 28));

  filterForm: FormGroup;
  handlerFilter = new FormControl();
  prospectName = new FormControl();
  handler = new FormControl([]);
  campaign = new FormControl([]);
  leadId = new FormControl(null);
  initFilterForm() {
    this.filterForm = this.fb.group({
      startDate: this.startDate,
      endDate: this.endDate,
      prospectName: this.prospectName,
      handler: this.handler,
      campaign: this.campaign,
      leadId: this.leadId,
    });
  }


  customSelectorMode = false;
  dateDropdownSelector: string;
  onSelectionChange() {
    if(this.dateDropdownSelector === 'thisWeek') {
      this.startDate.setValue(moment().startOf('week').toISOString());
      this.endDate.setValue(moment().endOf('week').toISOString());
    }else if(this.dateDropdownSelector === 'thisMonth') {
      this.startDate.setValue(moment().startOf('month').toISOString());
      this.endDate.setValue(moment().endOf('month').toISOString());
    }else if(this.dateDropdownSelector === 'lastThreeMonths') {
      this.startDate.setValue(moment().subtract(3, 'month').toISOString());
      this.endDate.setValue(moment().toISOString());
    }else if(this.dateDropdownSelector === 'lastSixMonths') {
      this.startDate.setValue(moment().subtract(6, 'month').toISOString());
      this.endDate.setValue(moment().toISOString());
    }
  }
}
