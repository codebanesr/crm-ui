import { Component, OnInit } from '@angular/core';
import {IDisposition} from './disposition.interface'
import { LeadsService } from 'src/app/leads.service';
import { ILead } from 'src/interfaces/leads.interface';
import { CampaignService } from '../campaign.service';
import { ICampaign } from '../leads/lead.interface';

@Component({
  selector: 'app-lead-solo',
  templateUrl: './lead-solo.component.html',
  styleUrls: ['./lead-solo.component.scss']
})
export class LeadSoloComponent implements OnInit {

  constructor(
    private leadsService: LeadsService,
    private campaignService: CampaignService
  ) { }

  selectedDisposition: string;
  selectedCampaignId: string;
  dispositionTypes: IDisposition[];
  selectedDispositionTree: any;
  selectedLead: ILead;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = 'time';
  loadingCampaignList = false;
  campaignList: any[] = [];
  ngOnInit(): void {
    this.initializeDispositionTypes();
    this.getLeadMappings();
    this.populateCampaignDropdown("");
  }

  populateCampaignDropdown(filter) {
    this.loadingCampaignList = true;
    this.campaignService.getCampaigns(1, 20, filter, "", 'asc').subscribe((data: any) => {
      this.loadingCampaignList = false;
      this.campaignList = data;
      console.log(data);
    }, error => {
        this.loadingCampaignList = false;
        console.log(error);
    })
  }

  getDispositionForCampaign() {
    this.campaignService.getDisposition(this.selectedCampaignId).subscribe((data: any)=>{
      this.dispositionNodes = data;
    }, error => {
        console.log(error);
    })
  }

  async getLeadMappings() {
    const { typeDict } = await this.leadsService.getLeadMappings();
    this.typeDict = typeDict;
    console.log(this.typeDict)
  }

  initializeDispositionTypes() {
    this.dispositionTypes = [{
      label: 'Follow Up',
      value: 'followUp'
    },{
      label: 'New Lead',
      value: 'newLead'
    },{
      label: 'Archived',
      value: 'archived'
      }]

    this.selectedDisposition = this.dispositionTypes[0].value;
  }

  dispositionTypeChange(event) {
    this.leadsService.getSingleLeadByDispositionAndCampaign(this.selectedDisposition, this.selectedCampaignId).subscribe(data => {
      this.initDispositionNodes(data._id);
      this.selectedLead = data;
    }, error => {
        console.log(error);
    })
  }

  clearAllFilters() {
    this.selectedDisposition = undefined;
  }

  disabledKeys = ['externalId', 'createdAt', 'updatedAt', '_id']
  isDisabled(leadKey: string) {
    if (this.disabledKeys.includes(leadKey)) {
      return true;
    }
    return false;
  }

  handleLeadSubmission(lead: ILead) {
    console.log(lead);
  }

  handleDispositionTreeEvent(event) {
    if (event.node.isLeaf) {
      console.log("set this to formControl", event.node.origin.title);
      // this.validateForm.patchValue({ leadStatus: event.node.origin.title });
    }
    event.node.isExpanded = !event.node.isExpanded;
  }

  handleDateOpenChange(event) {}
  handleDatePanelChange(event) { }
  handleSelectedCampaignChange(event) {
    console.log("selected campaign changed to: ", event);
    this.getDispositionForCampaign();
  }

  dispositionNodes: any;
  initDispositionNodes(campaignId: string) {
    this.campaignService.getDisposition(campaignId).subscribe(dispositionOptions => {
      this.dispositionNodes = dispositionOptions;
    }, error => {
        console.log("Error in fetching disposition nodes", error);
    })
  }
}
