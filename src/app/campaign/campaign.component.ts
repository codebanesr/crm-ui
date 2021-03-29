import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";
import { LoadingController, ToastController } from "@ionic/angular";
import { CampaignService } from "../home/campaign.service";
import { CurrentUser } from "../home/interfaces/global.interfaces";
import { PubsubService } from "../pubsub.service";
import { ICampaign, IGetCampaigns } from "./campaign.interface";


@Component({
  selector: "app-campaign",
  templateUrl: "./campaign.component.html",
  styleUrls: ["./campaign.component.scss"],
})
export class CampaignComponent implements OnInit {
  constructor(
    private campaignService: CampaignService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private pubsub: PubsubService,
    private toast: ToastController
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
    this.roleType = this.currentUserObj?.roleType;
    this.page = 1;
    this.perPage = 20;
    this.campaignOpts = ["default"];


    this.getCampaigns();
  }

  listOfData: any[] = [];

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500);
  }

  onPageIndexChange(index: number) {
    this.page = index;
    this.getCampaigns();
  }

  onPageSizeChange(size: number) {
    this.perPage = size;
    this.getCampaigns();
  }

  async getCampaigns() {
    // this.toast.loading("Fetching campaign list");
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      mode: 'md',
      message: 'Loading Campaigns ...'
    });

    await loading.present();
    this.campaignService
      .getCampaigns(this.page, this.perPage, this.filters, null, null)
      .subscribe(
        (data: any) => {
          loading.dismiss();
          this.processData(data);
        },
        (error) => {
          loading.dismiss();
        }
      );
  }

  total: number = 100;
  loading = false;
  onQueryParamsChange(paginator: MatPaginator): void {
    this.perPage = paginator.pageSize;
    this.page = this.page <= 0 ? 1 : this.page;
    this.getCampaigns();
  }

  quickStats: { campaign: string; followUp: number; overdue: number };
  processData(result: IGetCampaigns) {
    this.page = result.metadata.page;
    this.total = result.metadata.total;
    this.listOfData = [];
    this.quickStats = result.quickStatsAgg;
    for (let d of result.data) {
      this.listOfData.push({
        startDate: d.startDate,
        endDate: d.endDate,
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

  toggleArchiveStatus(event: Event, campaign: ICampaign) {
    event.stopPropagation();
    campaign.archived = !campaign.archived;
  }

  routeToSoloLead(data: ICampaign) {

    this.router.navigate(["home", "solo"], {
      queryParams: {
        campaignId: data._id,
        campaignName: data.campaignName,
      },
    });
  }


  handleCampaignChange(campaignName) {

  }
}
