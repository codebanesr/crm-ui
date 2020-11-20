import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { CampaignService } from "../campaign.service";
import {
  ClassValidationError,
  ModelInterface,
} from "../interfaces/global.interfaces";
import { ILead } from "../interfaces/leads.interface";
import { LeadsService } from "../leads.service";
import { Plugins } from "@capacitor/core";
import { UsersService } from "../users.service";
import { ICampaign } from "src/app/campaign/campaign.interface";
import { field } from "src/global.model";
import { NzTreeNode } from "ng-zorro-antd/tree";
import { ActivatedRoute } from "@angular/router";
const { Geolocation } = Plugins;

@Component({
  selector: "app-lead-solo",
  templateUrl: "./lead-solo.component.html",
  styleUrls: ["./lead-solo.component.scss"],
})
export class LeadSoloComponent implements OnInit {
  constructor(
    private leadsService: LeadsService,
    private campaignService: CampaignService,
    private msgService: NzMessageService,
    private fb: FormBuilder,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute
  ) {}

  modelFields: Array<field> = [];
  formModel: ModelInterface = {
    name: "App name...",
    description: "App Description...",
    theme: {
      bgColor: "ffffff",
      textColor: "555555",
      bannerImage: "",
    },
    attributes: this.modelFields,
  };

  selectedCampaign: string;
  selectedLead: ILead;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = "date";
  loadingCampaignList = false;
  campaignList: ICampaign[] = [];
  callDispositions;
  isVisible = false;
  jsonStringify = JSON.stringify;

  ngOnInit(): void {
    this.getLeadMappings();

    /** @Todo we dont have to fetch the entire list of campaigns here, only the campaign whose id was provided in the query params
     * coming from list campaigns page .....
     */
    this.populateCampaignDropdown("");
    this.initEmailForm();
    this.initEtAutocomplete();
    this.fetchUsersForReassignment();
    this.subscribeToQueryParamChange();
  }

  subscribeToQueryParamChange() {
    this.activatedRoute.queryParams.subscribe(
      async (data) => {
        this.selectedCampaign = data.campaignId;
        await this.getLeadMappings();
        // this.openFilterDrawer();
        this.getDispositionForCampaign();
        this.fetchNextLead();
        console.log("logging query params", data);
      },
      (error) => {
        this.msgService.error("Error in subscribing to query params");
      }
    );
  }

  usersForReassignment = [];
  fetchUsersForReassignment() {
    this.userService.getAllUsersHack().subscribe((result: any) => {
      this.usersForReassignment = result[0].users;
    });
  }

  populateCampaignDropdown(filter) {
    this.loadingCampaignList = true;
    this.campaignService.getCampaigns(1, 20, filter, "", "asc").subscribe(
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

    this.formModel = campaignObject[0]?.formModel;

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
    const geoLocation = await Geolocation.getCurrentPosition();
    const updateObj = {
      lead,
      geoLocation: {
        coordinates: [
          geoLocation.coords.latitude,
          geoLocation.coords.longitude,
        ],
      },
      requestedInformation: this.formModel.attributes.map((fld) => {
        return {
          [fld.label]: fld.value,
        };
      }),
    };

    if (this.selectedUserForReassignment) {
      updateObj["reassignmentInfo"] = this.selectedUserForReassignment;
    }

    updateObj["emailForm"] = this.emailForm.value;

    // any condition that has to be validated before submitting the form goes into this;
    const isSubmissionValid = this.checkSubmissionStatus();
    if (!isSubmissionValid) {
      return false;
    }

    this.leadsService.updateLead(lead.externalId, updateObj).subscribe(
      (data) => {
        // clean user reassigment once done
        this.selectedUserForReassignment = null;
        this.msgService.success("Successfully updated lead");
        if (fetchNextLead) {
          this.fetchNextLead();
        }
      },
      ({ error }: { error: ClassValidationError }) => {
        this.msgService.error(error.message[0]);
      }
    );
  }

  checkSubmissionStatus(): boolean {
    // validate form
    if (this.actions.isInformationRequested) {
      for (let element of this.formModel.attributes) {
        if (element.required && !element.value) {
          this.msgService.error(`${element.label} is a required field`);
          return false;
        }
      }
    }
    return true;
  }

  actions = {
    isInformationRequested: false,
  };

  getLinks(node: NzTreeNode): string[] {
    const links = [];
    while (node.parentNode !== null) {
      links.push(node.origin.title);
      node = node.parentNode;
    }

    return links;
  }

  handleDispositionTreeEvent(event) {
    if (event.node.isLeaf) {
      const links = this.getLinks(event.node);
      this.selectedLead.leadStatus = links.reverse().join(" / ");
      const action = event.node.origin.action;
      this.resetAllActionHandlers();
      if (action) {
        switch (action) {
          case "showForm":
            this.actions.isInformationRequested = true;
            break;
          default:
            console.log("no action matched");
        }
      }
      // this.validateForm.patchValue({ leadStatus: event.node.origin.title });
    }
    event.node.isExpanded = !event.node.isExpanded;
  }

  resetAllActionHandlers() {
    Object.keys(this.actions).forEach((action) => {
      this.actions[action] = false;
    });
  }

  handleDateOpenChange(event) {}
  handleLeadStatusChange(event) {}
  handleDatePanelChange(event) {}

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
            .getCampaignById(this.selectedLead.campaign, "campaignName")
            .subscribe((campaign) => {
              console.log("Found campaign by name", campaign);
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
    console.log("Button ok clicked!");
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

  isLeadEditMode = false;
  showLeadDetails() {
    this.isLeadEditMode = !this.isLeadEditMode;
  }

  isReassignmentDrawerVisible = false;
  showReassignmentDrawer() {
    this.isReassignmentDrawerVisible = true;
  }

  closeReassignmentDrawer() {
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

  historyLimit = 1;
  onShowMoreClick() {
    this.historyLimit = this.historyLimit === 1 ? 100 : 1;
  }
}
