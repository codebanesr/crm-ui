import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { CampaignService } from "../home/campaign.service";
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
    private activatedRouter: ActivatedRoute
  ) {}

  selectedCampaign: string;
  selectedLead: ILead = {} as any;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = "time";
  loadingCampaignList = false;
  campaignList: any[] = [];
  callDispositions;
  ngOnInit(): void {
    this.subscribeToQueryParamChange();
  }

  async populateCampaignDropdown(campaignId: string) {
    this.loadingCampaignList = true;
    this.campaignService
      .getCampaignById(campaignId)
      .subscribe(async (campaign) => {
        console.log(campaign);
      });
    await this.getLeadMappings(campaignId);
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
    // this.leadsService.updateLead(lead.externalId, lead).subscribe(data => {
    //   this.msgService.success("Successfully updated lead");
    // }, ({error}: {error: ClassValidationError}) => {
    //     this.msgService.error(error.message[0]);
    // });
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
}
