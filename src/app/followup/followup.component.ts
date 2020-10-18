import { Component, OnInit } from "@angular/core";
import { ICampaign } from "../campaign/campaign.interface";
import { CampaignService } from "../home/campaign.service";
import { ILead } from "../home/interfaces/leads.interface";
import { LeadsService } from "../home/leads.service";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";

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
    this.getLeadMappings();
    this.populateCampaignDropdown("");
  }

  onLeadSelectionChange() {
    this.getLeadMappings();
    this.getFollowUps();
  }

  total: number;
  getFollowUps() {
    this.leadService
      .getFollowUps({
        interval: this.selectedInterval,
        campaignName: this.selectedCampaign?.campaignName,
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
  async getLeadMappings() {
    const { typeDict } = await this.leadService.getLeadMappings(
      this.selectedCampaign._id
    );
    this.typeDict = typeDict;
    this.leadStatusOptions = this.typeDict.leadStatus.options;
  }
}
