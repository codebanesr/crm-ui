import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeadsService } from 'src/app/leads.service';
import { ILead } from 'src/interfaces/leads.interface';
import { CampaignService } from '../campaign.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ClassValidationError, ModelInterface } from 'src/global.interfaces';
import { error } from 'protractor';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { runInThisContext } from 'vm';
import { UsersService } from 'src/app/service/users.service';
import { field } from 'src/app/global.model';
import { ICampaign } from '../campaign/campaign.interface';

@Component({
  selector: 'app-lead-solo',
  templateUrl: './lead-solo.component.html',
  styleUrls: ['./lead-solo.component.scss'],
})
export class LeadSoloComponent implements OnInit {
  constructor(
    private leadsService: LeadsService,
    private campaignService: CampaignService,
    private msgService: NzMessageService,
    private fb: FormBuilder,
    private userService: UsersService
  ) {}

  modelFields: Array<field> = [];
  formModel: ModelInterface = {
    name: 'App name...',
    description: 'App Description...',
    theme: {
      bgColor: 'ffffff',
      textColor: '555555',
      bannerImage: '',
    },
    attributes: this.modelFields,
  };

  selectedCampaign: string;
  selectedLead: ILead;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = 'date';
  loadingCampaignList = false;
  campaignList: ICampaign[] = [];
  callDispositions;
  isVisible = false;

  ngOnInit(): void {
    this.getLeadMappings();
    this.populateCampaignDropdown('');
    this.initEmailForm();
    this.initEtAutocomplete();
    this.fetchUsersForReassignment();
  }

  usersForReassignment = [];
  fetchUsersForReassignment() {
    this.userService.getAllUsersHack().subscribe((result: any) => {
      this.usersForReassignment = result[0].users;
    });
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

  getDispositionForCampaign() {
    this.campaignService.getDisposition(this.selectedCampaign).subscribe(
      (data: any) => {
        this.callDispositions = data.options;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // leadStatusOptions: string[];
  // selectedLeadStatus: string;
  enabledKeys;
  async getLeadMappings() {
    const { typeDict } = await this.leadsService.getLeadMappings(
      this.selectedCampaign
    );

    const campaignObject = this.campaignList.filter(
      (element) => element._id === this.selectedCampaign
    );

    this.formModel = campaignObject[0].formModel;

    this.enabledKeys = campaignObject[0].editableCols;
    this.typeDict = typeDict;
    // this.leadStatusOptions = this.typeDict.leadStatus.options;
  }

  isDisabled(leadKey: string) {
    if (this.enabledKeys.includes(leadKey)) {
      return false;
    }
    return true;
  }

  async handleLeadSubmission(lead: ILead, fetchNextLead: boolean) {
    const geoLocation = await this.requestPosition();
    const updateObj = {
      lead,
      geoLocation: {
        coordinates: [
          geoLocation.coords.latitude,
          geoLocation.coords.longitude,
        ],
      },
    };

    if (this.selectedUserForReassignment) {
      updateObj['reassignmentInfo'] = this.selectedUserForReassignment;
    }

    this.leadsService.updateLead(lead.externalId, updateObj).subscribe(
      (data) => {
        // clean user reassigment once done
        this.selectedUserForReassignment = null;
        this.msgService.success('Successfully updated lead');
        if (fetchNextLead) {
          this.fetchNextLead();
        }
      },
      ({ error }: { error: ClassValidationError }) => {
        this.msgService.error(error.message[0]);
      }
    );
  }

  handleDispositionTreeEvent(event) {
    if (event.node.isLeaf) {
      console.log('set this to formControl', event.node.origin.title);
      // this.validateForm.patchValue({ leadStatus: event.node.origin.title });
    }
    event.node.isExpanded = !event.node.isExpanded;
  }

  handleDateOpenChange(event) {}
  handleLeadStatusChange(event) {}
  handleDatePanelChange(event) {}

  async handleCampaignChange(event) {
    console.log({ event, selectedCampaing: this.selectedCampaign });
    await this.getLeadMappings();
    this.openFilterDrawer();
    this.getDispositionForCampaign();
  }

  showAppliedFiltersOnNoResult = false;
  fetchNextLead(event?) {
    this.showAppliedFiltersOnNoResult = false;
    this.leadsService
      .fetchNextLead(this.selectedCampaign, this.typeDict, this.leadFilter)
      .subscribe(
        (data: any) => {
          this.selectedLead = data.result;
          if (!this.selectedLead) {
            this.showAppliedFiltersOnNoResult = true;
          }
          this.campaignService
            .getCampaignById(this.selectedLead.campaign, 'campaignName')
            .subscribe((campaign) => {
              console.log('Found campaign by name', campaign);
            });
        },
        (error) => {
          console.log(error);
        }
      );
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
        console.log({ selectedCampaign: this.selectedCampaign });
        this.campaignService
          .getAllEmailTemplates({
            searchTerm,
            campaignName: this.selectedLead.campaign,
          })
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

  showFilterDrawer = false;
  leadFilter = {} as any;
  openFilterDrawer(): void {
    console.log(this.typeDict);
    this.showFilterDrawer = true;
  }

  closeFilterDrawer(): void {
    this.showFilterDrawer = false;
  }

  printFilters() {
    console.log(this.leadFilter);
  }

  handleTagRemoval(tag) {
    delete this.leadFilter[tag];
    this.fetchNextLead();
  }

  requestPosition(): Promise<Position> {
    // additionally supplying options for fine tuning, if you want to
    var options = {
      enableHighAccuracy: true,
      timeout: 5000, // time in millis when error callback will be invoked
      maximumAge: 0, // max cached age of gps data, also in millis
    };

    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve(pos);
        },
        (err) => {
          reject(err);
        },
        options
      );
    });
  }

  isReassignmentDrawerVisible = false;
  showReassignmentModal() {
    this.isReassignmentDrawerVisible = true;
  }

  closeReassignmentModal() {
    this.isReassignmentDrawerVisible = false;
  }

  selectedUserForReassignment = null;
  selectUserForReassignment(user: {
    email: string;
    _id: string;
    fullname: string;
  }) {
    this.selectedUserForReassignment = user;
  }

  onCampaignFormUpdate(event) {}
}
