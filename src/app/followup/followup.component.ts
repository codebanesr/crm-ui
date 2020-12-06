import { Component, OnInit } from "@angular/core";
import { ICampaign } from "../campaign/campaign.interface";
import { CampaignService } from "../home/campaign.service";
import { ILead } from "../home/interfaces/leads.interface";
import { LeadsService } from "../home/leads.service";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: "app-followup",
  templateUrl: "./followup.component.html",
  styleUrls: ["./followup.component.scss"],
})
export class FollowupComponent implements OnInit {
  selectedCampaign: ICampaign;
  selectedInterval = null;
  listOfUpcomingLeads: ILead[] = [];
  objectkeys = Object.keys;

  constructor(
    private leadService: LeadsService,
    private campaignService: CampaignService
  ) {}

  ngOnInit() {
    this.populateCampaignDropdown("");
  }

  onLeadSelectionChange(event) {
    this.getFollowUps();
  }

  total: number;
  // startDate: string;
  // endDate: string;

  startDate: string;
  endDate: string;
  selectedCampaignId = 'all';

  getFollowUps() {
    // a^b; if either startDate or endDate is undefined return, if none is defined fetch all leads irrespective of campaign
    if(!!this.startDate !== !!this.endDate) {
      return;
    }
    this.leadService
      .getFollowUps({
        page: this.page,
        perPage: this.perPage,
        interval: [this.startDate, this.endDate],
        campaignId: this.selectedCampaignId || this.selectedCampaign._id
      })
      .subscribe(
        (result) => {
          this.total = result[0]?.metadata[0].total;
          this.listOfUpcomingLeads = result[0]?.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  campaignList: ICampaign[];
  async populateCampaignDropdown(hint: string) {
    this.campaignList = await this.campaignService.populateCampaignDropdown(
      hint
    );
  }

  today = new Date();
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

  leadStatusOptions: string[];
  typeDict = null;


  perPage = 20;
  page = 1;
  onPageSizeChange(size: number) {
    this.perPage = size;
    this.getFollowUps();
  }

  handlePaginationEvent(paginator: PageEvent) {
    this.page = paginator.pageIndex;
    this.getFollowUps();
  }

  displayedColumns: string[] = ['campaign', 'firstName', 'leadStatus', 'email'];
}

