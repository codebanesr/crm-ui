import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { ICampaign } from "../campaign/campaign.interface";
import { CampaignService } from "../home/campaign.service";
import { ClassValidationError } from "../home/interfaces/global.interfaces";
import { ILead } from "../home/interfaces/leads.interface";
import { LeadsService } from "../home/leads.service";
import { difference } from "lodash";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ReassignmentDrawerSheetComponent } from "../home/lead-solo/reassignment-drawer/reassignment-drawer.component";
import { UsersService } from "../home/users.service";

@Component({
  selector: "app-lead-create",
  templateUrl: "./lead-create.component.html",
  styleUrls: ["./lead-create.component.scss"],
})
export class LeadCreateComponent implements OnInit {
  constructor(
    private leadsService: LeadsService,
    private campaignService: CampaignService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private _bottomSheet: MatBottomSheet,
    private userService: UsersService
  ) {}

  selectedCampaign: ICampaign;
  selectedLead: ILead = {
    contact: [],
  } as any;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = "time";
  loadingCampaignList = false;
  campaignList: Pick<ICampaign, '_id' | 'campaignName'>[] = [];
  callDispositions;
  isContactDrawerVisible = false;
  otherData = [];
  ngOnInit(): void {
    this.initContactForm();
    this.subscribeToQueryParamChange();
    this.getCampaignNameAndId();
    this.fetchUsersForReassignment();
  }

  usersForReassignment = [];
  fetchUsersForReassignment() {
    this.userService.getAllUsersHack().subscribe((result: any) => {
      this.usersForReassignment = result[0].users;
    });
  }

  async onSelectedCampaignChange() {
    this.router.navigate(['home', 'lead-create'], {
      queryParams: {
        campaignId: this.selectedLead.campaignId
      }
    })
  }

  async getCampaignNameAndId() {
    this.campaignList = await this.campaignService.populateCampaignDropdown({select: ['_id', 'campaignName']});
  }

  async populateCampaignData() {
    this.loadingCampaignList = true;
    this.campaignService
      .getCampaignById(this.campaignId)
      .subscribe(async (campaign: ICampaign) => {
        this.selectedCampaign = campaign;
      });
    this.getLeadMappings(this.campaignId);
  }

  showOtherData = false;
  evaluateOtherData() {
    this.showOtherData = !this.showOtherData;

    if (!this.showOtherData) {
      this.selectedCampaign.groups = this.selectedCampaign.groups.filter(
        (g) => g.label !== "More"
      );
      return;
    }

    const alreadyIncluded = [];
    this.selectedCampaign.groups.forEach((g) => {
      alreadyIncluded.push(g.value);
    });

    this.otherData = difference(
      this.objectkeys(this.typeDict),
      alreadyIncluded
    );

    this.selectedCampaign.groups.push({
      label: "More",
      value: this.otherData,
      _id: "0",
    });
  }

  getDispositionForCampaign(campaignName: string) {
    this.campaignService.getDispositionByCampaignName(campaignName).subscribe(
      (data: any) => {
        this.callDispositions = data.options;
      },
      (error) => {
        // this.toastService.fail("Failed to fetch Disposition");
        console.log(error);
      }
    );
  }

  selectedLeadStatus: string;
  async getLeadMappings(campaignId: string) {
    const { typeDict } = await this.leadsService.getLeadMappings(campaignId);
    this.typeDict = typeDict;
  }

  disabledKeys = ["externalId", "createdAt", "updatedAt", "_id"];
  isDisabled(leadKey: string) {
    if (this.disabledKeys.includes(leadKey)) {
      return true;
    }
    return false;
  }

  handleLeadSubmission(lead: ILead) {
    /** @Todo all updates should move to lead-solo component, its already implemented there */
    // this.toastService.show("Saving lead");
    this.leadsService
      .createLead(
        lead,
        this.selectedCampaign._id,
        this.selectedCampaign.campaignName
      )
      .subscribe(
        (data: Pick<ILead, '_id' | 'campaign' | 'email'>) => {
          this.router.navigate(['home', 'solo'], {
            queryParams: {
              leadId: data._id,
              campaignId: this.campaignId,
              isBrowsed: true
            }
          })
          // this.toastService.show("Lead saved Successfully");
        },
        ({ error }: { error: ClassValidationError }) => {
          // this.toastService.fail("Failed to create lead");
        }
      );
  }

  handleDispositionTreeEvent(event) {
    if (event.node.isLeaf) {
      console.log("set this to formControl", event.node.origin.title);
      // this.validateForm.patchValue({ leadStatus: event.node.origin.title });
      this.selectedLead["disposition"] = event.node.origin.title;
    }
    event.node.isExpanded = !event.node.isExpanded;
  }

  handleDateOpenChange(event) {}
  handleLeadStatusChange(event) {}
  handleDatePanelChange(event) {}

  campaignId: string;
  async subscribeToQueryParamChange() {
    this.activatedRouter.queryParamMap.subscribe(data => {
      this.campaignId = data.get('campaignId');
      this.populateCampaignData();
    });
  }

  contactForm!: FormGroup;
  initContactForm() {
    this.contactForm = this.fb.group({
      label: [null, [Validators.required]],
      value: [null, [Validators.required]],
      category: [null, [Validators.required]],
    });
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

    // this.leadsService
    //   .addContact(this.selectedLead._id, this.contactForm.value)
    //   .subscribe(
    //     (success) => {
    //       let contact: Contact = this.contacts.create();

    //       contact.name = new ContactName(
    //         null,
    //         this.contactForm.get("label").value,
    //         ""
    //       );
    //       contact.phoneNumbers = [
    //         new ContactField("mobile", this.contactForm.get("value").value),
    //       ];
    //       contact.save().then(
    //         () => this.toast.info("saved to phone"),
    //         (error: any) => this.toast.info("Error saving contact to phone")
    //       );

    //       this.toastService.success("Updated contact information");
    //     },
    //     (error) => {
    //       this.selectedLead.contact.pop();
    //       this.toastService.fail("Failed to update contact information");
    //     }
    //   );

    /** @Todo check for form errors */
    if (addNext) {
      return this.contactForm.reset();
    }

    this.isContactDrawerVisible = false;
  }
}
