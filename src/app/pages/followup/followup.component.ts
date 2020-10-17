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
  listOfData: ILead[] = [];

  constructor(
    private leadService: LeadsService,
    private campaignService: CampaignService
  ) {}

  ngOnInit() {
    this.populateCampaignDropdown('');
    this.getFollowUps();
  }

  getFollowUps() {
    this.leadService
      .getFollowUps({
        interval: this.selectedInterval,
        campaignName: this.selectedCampaign.campaignName,
      })
      .subscribe(
        (data) => {
          console.log(data);
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
    console.log(this.campaignList);
  }

  today = new Date();
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };
}
