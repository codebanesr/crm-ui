import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
import { CallNumber } from "@ionic-native/call-number/ngx";
const { Geolocation } = Plugins;
import { en_US, ToastService } from "ng-zorro-antd-mobile";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName,
} from "@ionic-native/contacts/ngx";
import * as moment from "moment";

import { isEmpty } from "lodash";
@Component({
  selector: "app-lead-solo",
  templateUrl: "./lead-solo.component.html",
  styleUrls: ["./lead-solo.component.scss"],
})
export class LeadSoloComponent implements OnInit {
  constructor(
    private leadsService: LeadsService,
    private campaignService: CampaignService,
    private fb: FormBuilder,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private toast: ToastService,
    private callNumber: CallNumber,
    private contacts: Contacts
  ) {}

  modelFields: Array<field> = [];
  isEmpty = isEmpty;
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

  selectedCampaignId: string;
  selectedLead: ILead;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = "date";
  loadingCampaignList = false;
  campaignList: ICampaign[] = [];
  callDispositions;
  isVisible = false;
  jsonStringify = JSON.stringify;
  locale = en_US;

  ngOnInit(): void {
    /** @Todo we dont have to fetch the entire list of campaigns here, only the campaign whose id was provided in the query params
     * coming from list campaigns page .....
     */

    this.populateCampaignDropdown("");
    this.initEmailForm();
    this.fetchUsersForReassignment();
    this.initContactForm();
  }

  contactForm!: FormGroup;
  initContactForm() {
    this.contactForm = this.fb.group({
      label: [null, [Validators.required]],
      value: [null, [Validators.required]],
      category: [null, [Validators.required]],
    });
  }

  onPhoneClick(number: string) {
    console.log(number);
    this.callNumber
      .callNumber(number.trim(), true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }

  selectedCampaign = {} as any;
  subscribeToQueryParamChange() {
    this.activatedRoute.queryParams.subscribe(
      async (data) => {
        this.selectedCampaignId = data.campaignId;

        await this.getLeadMappings();
        this.getDispositionForCampaign();

        // if leadId is sent from leads component ts then fetch that lead, also once lead is fetched clear the query params
        if (data.leadId) {
          this.fetchLeadById(data.leadId);
        } else {
          this.fetchNextLead();
        }
        console.log("logging query params", data);
      },
      (error) => {
        this.toast.fail("Error in subscribing to query params");
      }
    );
  }

  usersForReassignment = [];
  fetchUsersForReassignment() {
    this.userService.getAllUsersHack().subscribe((result: any) => {
      this.usersForReassignment = result[0].users;
    });
  }

  /** @Todo remove this, we are not populating list of campaigns */
  populateCampaignDropdown(filter) {
    this.loadingCampaignList = true;
    this.campaignService.getCampaigns(1, 20, filter, "", "asc").subscribe(
      (result: any) => {
        this.loadingCampaignList = false;
        this.campaignList = result.data;
        this.subscribeToQueryParamChange();
      },
      (error) => {
        this.loadingCampaignList = false;
        console.log(error);
      }
    );
  }

  getDispositionForCampaign() {
    this.campaignService.getDisposition(this.selectedCampaignId).subscribe(
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
  leadGroups: { label: string; value: string[]; _id: string }[] = [];
  async getLeadMappings() {
    const { typeDict } = await this.leadsService.getLeadMappings(
      this.selectedCampaignId
    );

    const campaignObject = this.campaignList.filter(
      (element) => element._id === this.selectedCampaignId
    );

    this.leadGroups = campaignObject[0]?.groups;
    this.formModel = campaignObject[0]?.formModel;

    this.enabledKeys = campaignObject[0]?.editableCols;
    this.typeDict = typeDict;
    this.populateEmailTemplateDropdown(campaignObject[0]);
  }

  populateEmailTemplateDropdown(campaignObj: ICampaign) {
    this.campaignService.getAllEmailTemplates(campaignObj._id).subscribe(
      (data) => {
        this.emailTemplates = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isDisabled(leadKey: string) {
    if (this.enabledKeys?.includes(leadKey)) {
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

    this.leadsService.updateLead(lead._id, updateObj).subscribe(
      (data) => {
        // clean user reassigment once done
        this.selectedUserForReassignment = null;
        this.toast.success("Successfully updated lead");
        if (fetchNextLead) {
          this.fetchNextLead();
        }
      },
      ({ error }: { error: ClassValidationError }) => {
        this.toast.fail(error.message[0]);
      }
    );
  }

  checkSubmissionStatus(): boolean {
    // validate form
    if (this.actions.isInformationRequested) {
      for (let element of this.formModel.attributes) {
        if (element.required && !element.value) {
          this.toast.show(`${element.label} is a required field`);
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

  showFab = false;
  followUpAction = false;
  appointmentAction = false;
  salesCallAction = false;
  showFormAction = false;
  showFollowUpInput = false;
  handleDispositionTreeEvent(event) {
    // ["followUp", "appointment", "salesCall"]
    if (event.node.isLeaf) {
      const links = this.getLinks(event.node);
      this.selectedLead.leadStatus = links.reverse().join(" / ");
      const action = event.node.origin.action;
      console.log(action);

      this.resetAllActionHandlers();
      if (action?.includes("followUp")) {
      }

      if (action?.includes("appointment")) {
      }

      if (action?.includes("salesCall")) {
      }

      if (action?.includes("showForm")) {
        this.actions.isInformationRequested = true;
      }
      // this.validateForm.patchValue({ leadStatus: event.node.origin.title });
    }
    event.node.isExpanded = !event.node.isExpanded;
  }

  today = new Date().toISOString();
  handleFollowUp(event) {
    if (event.value == 1) {
      this.selectedLead.followUp = moment().toDate();
    } else if (event.value == 2) {
      // after 10 mins
      this.selectedLead.followUp = moment().add(10, "minutes").toDate();
    } else if (event.value == 3) {
      // 1 hr
      this.selectedLead.followUp = moment().add(1, "hour").toDate();
    } else if (event.value == 4) {
      // tomorrow
      this.selectedLead.followUp = moment().add(24, "hours").toDate();
    }
  }

  fabTransition() {
    console.log("transition");
  }

  resetAllActionHandlers() {
    Object.keys(this.actions).forEach((action) => {
      this.actions[action] = false;
    });
  }

  handleLeadStatusChange(event) {}

  showAppliedFiltersOnNoResult = false;
  fetchNextLead() {
    this.showAppliedFiltersOnNoResult = false;
    this.toast.loading("Fetching next lead");
    this.leadsService
      .fetchNextLead(this.selectedCampaignId, this.typeDict, this.leadFilter)
      .subscribe(
        (data: any) => {
          this.toast.hide();
          this.selectedLead = data.result;
          if (!this.selectedLead) {
            this.showAppliedFiltersOnNoResult = true;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  fetchLeadById(id: string) {
    this.toast.info("Fetching lead");
    this.leadsService.getLeadById(id).subscribe(
      (data: ILead) => {
        this.toast.hide();
        this.selectedLead = data;
      },
      (err) => {
        this.toast.hide();
        console.log(err);
      }
    );
  }

  emailForm: FormGroup;
  emailTemplates: any;
  tempObj: any = {};
  emailModel;
  initEmailForm() {
    this.emailForm = this.fb.group({
      subject: [null],
      content: [null],
      attachments: [null],
    });
  }

  attachments: any[] = [];

  submitEmailForm(model) {
    console.log(model);
  }

  selectedEmailTemplate: any;
  populateEmailModal(event) {
    this.selectedEmailTemplate = event;

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

  isContactDrawerVisible = false;
  showContactDrawer() {
    this.isContactDrawerVisible = true;
  }

  hideContactDrawer() {
    this.isContactDrawerVisible = false;
  }

  submitContactForm(addNext: boolean) {
    for (const i in this.contactForm.controls) {
      this.contactForm.controls[i].markAsDirty();
      this.contactForm.controls[i].updateValueAndValidity();
    }

    /** @Todo validate form before submitting, also add backend validation */
    console.log(this.contactForm.value, this.selectedLead.contact);

    // in case backend sends an empty array, should not happen but is possible sometimes
    this.selectedLead.contact = this.selectedLead.contact || [];
    this.selectedLead.contact.push(this.contactForm.value);

    this.leadsService
      .addContact(this.selectedLead._id, this.contactForm.value)
      .subscribe(
        (success) => {
          let contact: Contact = this.contacts.create();

          contact.name = new ContactName(
            null,
            this.contactForm.get("label").value,
            ""
          );
          contact.phoneNumbers = [
            new ContactField("mobile", this.contactForm.get("value").value),
          ];
          contact.save().then(
            () => this.toast.info("saved to phone"),
            (error: any) => this.toast.info("Error saving contact to phone")
          );

          this.toast.success("Updated contact information");
        },
        (error) => {
          this.selectedLead.contact.pop();
          this.toast.fail("Failed to update contact information");
        }
      );

    /** @Todo check for form errors */
    if (addNext) {
      return this.contactForm.reset();
    }

    this.isContactDrawerVisible = false;
  }

  name = "shanur";
  value = new Date();

  currentDateFormat(date, format: string = "yyyy-mm-dd HH:MM"): any {
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    return format
      .replace("yyyy", date.getFullYear())
      .replace("mm", pad(date.getMonth() + 1))
      .replace("dd", pad(date.getDate()))
      .replace("HH", pad(date.getHours()))
      .replace("MM", pad(date.getMinutes()))
      .replace("ss", pad(date.getSeconds()));
  }

  onOk(result: Date) {
    this.name = this.currentDateFormat(result);
    this.value = result;
  }

  formatIt(date: Date, form: string) {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    if (form === "YYYY-MM-DD") {
      return dateStr;
    }
    if (form === "HH:mm") {
      return timeStr;
    }
    return `${dateStr} ${timeStr}`;
  }

  handleDateOpenChange(event) {}
  handleDatePanelChange(event) {}


  defaultContactValue = "mobile"
  getInputType(readableType) {
    if(readableType.type === 'string') {
      return 'text';
    }
    return readableType.type;
  }
}
