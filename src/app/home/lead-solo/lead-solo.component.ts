import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { PubsubService } from "src/app/pubsub.service";
import { CampaignService } from "../campaign.service";
import { ClassValidationError } from "../interfaces/global.interfaces";
import { ILead } from "../interfaces/leads.interface";
import { LeadsService } from "../leads.service";
import { Plugins } from "@capacitor/core";
import { ModalController } from "@ionic/angular";
import { LeadsComponent } from "../leads/leads.component";
import { UsersService } from "../users.service";
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
    private pubsub: PubsubService,
    private userService: UsersService
  ) {}

  selectedCampaign: string;
  selectedLead: ILead;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = "date";
  loadingCampaignList = false;
  campaignList: any[] = [];
  callDispositions;
  isVisible = false;

  ngOnInit(): void {
    this.pubsub.$pub("HEADING", { heading: "Single Lead" });
    this.getLeadMappings();
    this.populateCampaignDropdown("");
    this.initEmailForm();
    this.initEtAutocomplete();
    this.fetchUsersForReassignment();
  }

  usersForReassignment = [];
  fetchUsersForReassignment() {
    this.userService.getAllUsersHack().subscribe((result: any) => {
      console.log(result);
      this.usersForReassignment = result[0].users;
    });
  }

  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }

  showEmailModal(): void {
    this.isVisible = true;
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

  isLeadEditMode = false;
  leadStatusOptions: string[];
  selectedLeadStatus: string;
  async getLeadMappings() {
    const { typeDict } = await this.leadsService.getLeadMappings(
      this.selectedCampaign
    );
    this.typeDict = typeDict;
    this.leadStatusOptions = this.typeDict.leadStatus.options;
  }

  disabledKeys = ["externalId", "createdAt", "updatedAt", "_id"];
  isDisabled(leadKey: string) {
    if (this.disabledKeys.includes(leadKey)) {
      return true;
    }
    return false;
  }

  async handleLeadSubmission(lead: ILead, fetchNextLead: boolean) {
    const geoLocation = await Geolocation.getCurrentPosition();

    console.log(geoLocation);
    this.leadsService
      .updateLead(lead.externalId, {
        lead,
        geoLocation: {
          coordinates: [
            geoLocation.coords.latitude,
            geoLocation.coords.longitude,
          ],
        },
      })
      .subscribe(
        (data) => {
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

  handleDispositionTreeEvent(event) {
    if (event.node.isLeaf) {
      console.log("set this to formControl", event.node.origin.title);
      // this.validateForm.patchValue({ leadStatus: event.node.origin.title });
    }
    event.node.isExpanded = !event.node.isExpanded;
  }

  handleDateOpenChange(event) {}
  handleLeadStatusChange(event) {}
  handleDatePanelChange(event) {}
  async handleCampaignChange(event) {
    console.log("selected campaign changed to: ", event);
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

  leadFilter = {} as any;
  showFilterDrawer = false;
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
}
