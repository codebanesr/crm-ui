import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICampaign } from '../../../campaign/campaign.interface';
import { ITypeDict } from '../../interfaces/global.interfaces';
import { ILead } from '../../interfaces/leads.interface';
import { Plugins } from "@capacitor/core";
import { List } from 'immutable';
const { Share } = Plugins;

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanelComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  @Input() typeDict: ITypeDict;
  @Input() leads: List<ILead>;
  @Input() selectedCampaign: ICampaign;
  ngOnInit() {}


  leadKeys = [];
  ngOnChanges() {
    if(this.typeDict && this.selectedCampaign && this.leads) {
      this.leadKeys = Object.keys(this.typeDict);
    }
  }
  
  trackLead(index, lead) {
    return lead._id
  }

  trackKeys(index, key) {
    return key;
  }

  handleLeadEdit(lead) {
    this.router.navigate(["home", "solo"], {
      queryParams: {
        isBrowsed: true,
        campaignId: this.selectedCampaign._id,
        leadId: lead._id,
      },
    });
  }

  async onSocialShareClick(event, data) {
    await Share.share({
      title: "See cool stuff",
      text: "Really awesome stuff ",
      url: "https://thefosstech.com",
      dialogTitle: "Share with buddies",
    });
  }
}
