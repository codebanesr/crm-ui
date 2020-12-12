import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastService } from "ng-zorro-antd-mobile";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzUploadListComponent } from "ng-zorro-antd/upload";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { CampaignService } from "../home/campaign.service";
import { CurrentUser } from "../home/interfaces/global.interfaces";
import { ColumnItem, DataItem } from "../home/interfaces/listOfCols";
import { PubsubService } from "../pubsub.service";
import { UploadService } from "../upload.service";
import { ICampaign } from "./campaign.interface";

@Component({
  selector: "app-campaign",
  templateUrl: "./campaign.component.html",
  styleUrls: ["./campaign.component.scss"],
})
export class CampaignComponent implements OnInit {
  constructor(
    private campaignService: CampaignService,
    private toast: ToastService,
    private router: Router,
    private pubsub: PubsubService,
    private uploadService: UploadService
  ) {}

  campaignOpts: string[];
  handlerEmailOpts: string[] = ["santa", "banta"];
  page: number;
  perPage: number;
  filters: any;
  currentUserObj: CurrentUser;
  roleType: string;
  ngOnInit(): void {
    this.pubsub.$pub("HEADING", { heading: "Campaigns" });

    this.currentUserObj = JSON.parse(localStorage.getItem("currentUser"));
    this.roleType = this.currentUserObj.roleType;
    this.page = 1;
    this.perPage = 20;
    this.campaignOpts = ["default"];


    this.getCampaigns();
  }
  listOfColumns: ColumnItem[] = [
    { name: "Campaign Name" },
    { name: "Created By" },
    { name: "Start Date" },
    { name: "End Date" },
  ];

  listOfData: any[] = [];

  trackByName(_: number, item: ColumnItem): string {
    return item.name;
  }

  onPageIndexChange(index: number) {
    this.page = index;
    this.getCampaigns();
  }

  onPageSizeChange(size: number) {
    this.perPage = size;
    this.getCampaigns();
  }

  getCampaigns() {
    this.toast.loading("Fetching campaign list");
    this.campaignService
      .getCampaigns(this.page, this.perPage, this.filters, null, null)
      .subscribe(
        (data: any) => {
          this.toast.hide();
          this.processData(data);
        },
        (error) => {
          this.toast.fail(error.message);
        }
      );
  }

  totalPage: number = 0;
  quickStats: { campaign: string; followUp: number; overdue: number };
  processData(result: {
    data: ICampaign[];
    interval: string[];
    metadata: { total: number; page: number };
    quickStatsAgg: {
      campaign: string;
      followUp: number;
      overdue: number;
    };
  }) {
    this.page = result.metadata.page;
    this.totalPage = result.metadata.total / this.perPage;
    this.listOfData = [];
    this.quickStats = result.quickStatsAgg;
    for (let d of result.data) {
      this.listOfData.push({
        startDate: d.interval[0],
        endDate: d.interval[1],
        createdBy: d.createdBy,
        campaignName: d.campaignName,
        archived: d.archived,
        _id: d._id,
      });
    }
  }
  validateForm!: FormGroup;

  submitForm(): void {
    this.filters = this.validateForm.value;
    this.getCampaigns();
  }

  gotoDetailedView(data: any) {
    this.router.navigate(["home", "campaigns", "create"], {
      queryParams: { id: data._id },
    });
  }

  archiveCampaign(campaign: ICampaign) {
    this.campaignService.archiveCampaign(campaign).subscribe(
      (data) => {
        this.toast.success(
          `${campaign.campaignName} has been archived successfully`
        );
      },
      (error) => {
        this.toast.fail(
          `There was an error in archiving ${campaign.campaignName}`
        );
      }
    );
  }

  toggleArchiveStatus(event: Event, campaign: ICampaign) {
    event.stopPropagation();
    campaign.archived = !campaign.archived;
  }

  routeToSoloLead(data: ICampaign) {
    console.log(data);
    this.router.navigate(["home", "solo"], {
      queryParams: {
        campaignId: data._id,
        campaignName: data.campaignName,
      },
    });
  }


  handleCampaignChange(campaignName) {
    console.log(campaignName);
  }
}
