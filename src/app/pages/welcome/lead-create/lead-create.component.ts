import { Component, OnInit } from '@angular/core';
import { LeadsService } from 'src/app/leads.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../campaign.service';
import { ILead } from 'src/interfaces/leads.interface';
import { ClassValidationError } from 'src/global.interfaces';

@Component({
  selector: 'app-lead-create',
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.scss'],
})
export class LeadCreateComponent implements OnInit {
  constructor(
    private leadsService: LeadsService,
    private campaignService: CampaignService,
    private msgService: NzMessageService,
    private activatedRouter: ActivatedRoute
  ) {}

  selectedCampaign: string;
  selectedLead: ILead;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = 'time';
  loadingCampaignList = false;
  campaignList: any[] = [];
  callDispositions;
  ngOnInit(): void {
    this.subscribeToQueryParamChange();
    this.getLeadMappings();
    this.populateCampaignDropdown('');
  }

  populateCampaignDropdown(filter) {
    this.loadingCampaignList = true;
    this.campaignService.getCampaigns(1, 20, filter, '', 'asc').subscribe(
      (result: any) => {
        this.loadingCampaignList = false;
        this.campaignList = result.data;
      },
      (error) => {
        this.loadingCampaignList = false;
        console.log(error);
      }
    );
  }

  getDispositionForCampaign(campaignName: string) {
    this.campaignService.getDispositionByCampaignName(campaignName).subscribe(
      (data: any) => {
        this.callDispositions = data.options;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  leadStatusOptions: string[];
  selectedLeadStatus: string;
  async getLeadMappings() {
    const { typeDict } = await this.leadsService.getLeadMappings(
      this.selectedCampaign
    );
    this.typeDict = typeDict;
    this.leadStatusOptions = this.typeDict.leadStatus.options;
  }

  disabledKeys = ['externalId', 'createdAt', 'updatedAt', '_id'];
  isDisabled(leadKey: string) {
    if (this.disabledKeys.includes(leadKey)) {
      return true;
    }
    return false;
  }

  handleLeadSubmission(lead: ILead) {
    /** @Todo all updates should move to lead-solo component, its already implemented there */
    // this.leadsService.updateLead(lead.externalId, lead).subscribe(data => {
    //   this.msgService.success("Successfully updated lead");
    // }, ({error}: {error: ClassValidationError}) => {
    //     this.msgService.error(error.message[0]);
    // });
  }

  handleDispositionTreeEvent(event) {
    if (event.node.isLeaf) {
      console.log('set this to formControl', event.node.origin.title);
      // this.validateForm.patchValue({ leadStatus: event.node.origin.title });
      this.selectedLead['disposition'] = event.node.origin.title;
    }
    event.node.isExpanded = !event.node.isExpanded;
  }

  handleDateOpenChange(event) {}
  handleLeadStatusChange(event) {}
  handleDatePanelChange(event) {}
  async handleCampaignChange(event) {
    console.log('selected campaign changed to: ', event);
    await this.getLeadMappings();
    this.getDispositionForCampaign('asd');
  }

  leadId: string;
  subscribeToQueryParamChange() {
    const { id } = this.activatedRouter.snapshot.queryParams;
    if (!id) {
      return;
    }

    this.leadId = id;
    this.leadsService.getLeadById(id).subscribe(
      (lead: ILead) => {
        this.selectedLead = lead;
        this.getDispositionForCampaign(this.selectedLead.campaign);
      },
      (error) => {
        this.msgService.error('Failed to fetch data for ticket id ', id);
      }
    );
  }
}
