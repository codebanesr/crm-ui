import { Component, OnInit } from '@angular/core';
import { AlarmData } from '../../../interfaces/alarms';
import { AlarmsService } from 'src/app/alarms.service';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LeadsService } from 'src/app/leads.service';
import { CampaignService } from '../welcome/campaign.service';
import { ICampaign } from '../welcome/campaign/campaign.interface';
import { ILead } from 'src/interfaces/leads.interface';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

@Component({
  selector: 'app-alarms',
  templateUrl: './followup.component.html',
  styleUrls: ['./followup.component.scss'],
})
export class FollowUpComponent implements OnInit {
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
    this.populateCampaignDropdown('');
  }

  onLeadSelectionChange() {
    this.getLeadMappings();
    this.getFollowUps();
  }

  total: number;
  page = 1;
  perPage = 20;
  getFollowUps() {
    this.leadService
      .getFollowUps({
        page: this.page,
        perPage: this.perPage,
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

  onPageSizeChange(size: number) {
    this.perPage = size;
    this.getFollowUps();
  }

  onPageIndexChange(index: number) {
    this.page = index;
    this.getFollowUps();
  }
}
