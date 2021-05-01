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
import { PubsubService } from "../pubsub.service";
import { HEADER_FILTERS } from "src/global.constants";

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
    private userService: UsersService,
    private pubsub: PubsubService
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
  otherData = [];
  ngOnInit(): void {
    this.initContactForm();
    this.subscribeToQueryParamChange();
    this.getCampaignNameAndId();
    this.fetchUsersForReassignment();
  }


  ionViewWillEnter() {
    this.pubsub.$pub(HEADER_FILTERS, []);
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
        campaignId: this.selectedLead.campaignId,
        email: this.selectedLead.email
      }
    })
  }

  async getCampaignNameAndId() {
    this.campaignList = await this.campaignService.populateCampaignDropdown({select: ['_id', 'campaignName']});
  }

  async populateCampaignData() {
    this.loadingCampaignList = true;
    this.campaignService
      .getCampaignById(this.selectedLead.campaignId)
      .subscribe(async (campaign: ICampaign) => {
        this.selectedCampaign = campaign;
      });
    this.getLeadMappings(this.selectedLead.campaignId);
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

  // getDispositionForCampaign(campaignName: string) {
  //   this.campaignService.getDispositionByCampaignName(campaignName).subscribe(
  //     (data: any) => {
  //       this.callDispositions = data.options;
  //     },
  //     (error) => {
  //       // this.toastService.fail("Failed to fetch Disposition");
  //       console.log(error);
  //     }
  //   );
  // }

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
              campaignId: this.selectedCampaign._id,
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

  async subscribeToQueryParamChange() {
    this.activatedRouter.queryParamMap.subscribe(data => {
      this.selectedLead.campaignId = data.get('campaignId');
      this.selectedLead.email = data.get('email');
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
}
