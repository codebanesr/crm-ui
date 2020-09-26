import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeadsService } from 'src/app/leads.service';
import { ILead } from 'src/interfaces/leads.interface';
import { CampaignService } from '../campaign.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ClassValidationError } from 'src/global.interfaces';
import { error } from 'protractor';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-lead-solo',
  templateUrl: './lead-solo.component.html',
  styleUrls: ['./lead-solo.component.scss']
})
export class LeadSoloComponent implements OnInit {

  constructor(
    private leadsService: LeadsService,
    private campaignService: CampaignService,
    private msgService: NzMessageService,
    private fb: FormBuilder
  ) { }

  selectedCampaign: string;
  selectedLead: ILead;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = 'time';
  loadingCampaignList = false;
  campaignList: any[] = [];
  callDispositions;
  isVisible = false;

  ngOnInit(): void {
    this.getLeadMappings();
    this.populateCampaignDropdown("");
    this.initEmailForm();
    this.initEtAutocomplete();
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }


  showEmailModal(): void {
    this.isVisible = true;
  }


  populateCampaignDropdown(filter) {
    this.loadingCampaignList = true;
    this.campaignService.getCampaigns(1, 20, filter, "", 'asc').subscribe((result: any) => {
      this.loadingCampaignList = false;
      this.campaignList = result.data;
    }, error => {
        this.loadingCampaignList = false;
        console.log(error);
    })
  }

  getDispositionForCampaign() {
    this.campaignService.getDisposition(this.selectedCampaign).subscribe((data: any)=>{
      this.callDispositions = data.options;
    }, error => {
        console.log(error);
    })
  }

  leadStatusOptions: string[];
  selectedLeadStatus: string;
  async getLeadMappings() {
    const { typeDict } = await this.leadsService.getLeadMappings(this.selectedCampaign);
    this.typeDict = typeDict;
    this.leadStatusOptions = this.typeDict.leadStatus.options;
  }

  disabledKeys = ['externalId', 'createdAt', 'updatedAt', '_id']
  isDisabled(leadKey: string) {
    if (this.disabledKeys.includes(leadKey)) {
      return true;
    }
    return false;
  }

  handleLeadSubmission(lead: ILead) {
    this.leadsService.updateLead(lead.externalId, lead).subscribe(data => {
      this.msgService.success("Successfully updated lead");
    }, ({error}: {error: ClassValidationError}) => {
        this.msgService.error(error.message[0]);
    });
  }

  handleDispositionTreeEvent(event) {
    if (event.node.isLeaf) {
      console.log("set this to formControl", event.node.origin.title);
      // this.validateForm.patchValue({ leadStatus: event.node.origin.title });
    }
    event.node.isExpanded = !event.node.isExpanded;
  }

  handleDateOpenChange(event) {}
  handleLeadStatusChange(event){}
  handleDatePanelChange(event) { }
  async handleCampaignChange(event) {
    console.log("selected campaign changed to: ", event);
    await this.getLeadMappings();
    this.getDispositionForCampaign();
  }

  fetchNextLead(event?) {
    this.leadsService.fetchNextLead(this.selectedCampaign, this.selectedLeadStatus).subscribe((data: any)=>{
      this.selectedLead = data.result;
      this.campaignService.getCampaignById(this.selectedLead.campaign, 'campaignName').subscribe(campaign => {
        console.log("Found campaign by name", campaign);
      })
    }, error => {
        console.log(error);
    })
  }

  emailForm: FormGroup;
  emailTemplates: any;
  emailModel;
  emailFields: FormlyFieldConfig[];
  initEmailForm() {
    this.emailForm = this.fb.group({
      subject: [null],
      content: [null],
      attachments: [null],
    });
  }

  etFormControl = new FormControl([null]);
  attachments: any[] = [];
  initEtAutocomplete() {
    this.etFormControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm) => {
        console.log({selectedCampaign: this.selectedCampaign})
        this.campaignService
          .getAllEmailTemplates({ searchTerm, campaignName: this.selectedLead.campaign })
          .subscribe((emailTemplates: any) => {
            this.emailTemplates = emailTemplates;
          });
      });
  }


  submitEmailForm(model) {
    console.log(model);
  }


  selectedEmailTemplate: any;
  populateEmailModal(event) {
    console.log(typeof event, event.nzValue);
    this.selectedEmailTemplate = event.nzValue;

    this.attachments = this.selectedEmailTemplate.attachments;
    this.emailForm.patchValue({
      subject: this.selectedEmailTemplate.subject,
      content: this.selectedEmailTemplate.content,
    });
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }
}
