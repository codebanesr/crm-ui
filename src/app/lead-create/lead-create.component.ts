import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "ng-zorro-antd-mobile";
import { NzMessageService } from "ng-zorro-antd/message";
import { ICampaign } from "../campaign/campaign.interface";
import { CampaignService } from "../home/campaign.service";
import { ClassValidationError } from "../home/interfaces/global.interfaces";
import { ILead } from "../home/interfaces/leads.interface";
import { LeadsService } from "../home/leads.service";

@Component({
  selector: "app-lead-create",
  templateUrl: "./lead-create.component.html",
  styleUrls: ["./lead-create.component.scss"],
})
export class LeadCreateComponent implements OnInit {
  constructor(
    private leadsService: LeadsService,
    private campaignService: CampaignService,
    private msgService: NzMessageService,
    private activatedRouter: ActivatedRoute,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {}

  selectedCampaign: ICampaign;
  selectedLead: ILead = {
    contact: [],
  } as any;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = "time";
  loadingCampaignList = false;
  campaignList: any[] = [];
  callDispositions;
  isContactDrawerVisible = false;
  ngOnInit(): void {
    this.initContactForm();
    this.subscribeToQueryParamChange();
  }

  async populateCampaignDropdown(campaignId: string) {
    this.loadingCampaignList = true;
    this.campaignService
      .getCampaignById(campaignId)
      .subscribe(async (campaign: ICampaign) => {
        this.selectedCampaign = campaign;
      });
    await this.getLeadMappings(campaignId);
  }

  getDispositionForCampaign(campaignName: string) {
    this.campaignService.getDispositionByCampaignName(campaignName).subscribe(
      (data: any) => {
        this.callDispositions = data.options;
      },
      (error) => {
        this.toastService.fail("Failed to fetch Disposition");
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
    this.toastService.show("Saving lead");
    this.leadsService
      .createLead(
        lead,
        this.selectedCampaign._id,
        this.selectedCampaign.campaignName
      )
      .subscribe(
        (data) => {
          this.toastService.show("Lead saved Successfully");
          this.msgService.success("Successfully updated lead");
        },
        ({ error }: { error: ClassValidationError }) => {
          this.toastService.fail("Failed to create lead");
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

  camapaignId: string;
  async subscribeToQueryParamChange() {
    const { campaignId } = this.activatedRouter.snapshot.queryParams;
    if (!campaignId) {
      return;
    }

    this.camapaignId = campaignId;
    this.populateCampaignDropdown(this.camapaignId);
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
