import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CampaignService } from "../home/campaign.service";
import { ILead } from "../home/interfaces/leads.interface";
import { LeadSoloComponent } from "../home/lead-solo/lead-solo.component";
import { LeadsService } from "../home/leads.service";

interface IHistory {
  lead: string;
  newUser: string;
  requestedInformation: any[];
  createdAt: string;
  geoLocation: { coordinates: string[] };
}

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.scss"],
})
export class TransactionsComponent implements OnInit {
  constructor(
    private leadService: LeadsService,
    public modalController: ModalController,
    private router: Router
  ) {}

  transactions: IHistory[] = [];
  pagination = { sortBy: "createdAt", sortOrder: "ASC", page: 1, perPage: 20 };
  filters = {};
  histories: any[] = [];
  ngOnInit() {
    this.leadService
      .getTransactions(this.pagination, this.filters)
      .subscribe((histories: IHistory[]) => {
        this.transactions = histories;
      });
  }

  async showLead(leadId: string) {
    this.router.navigate(["home", "solo"], {
      queryParams: {
        leadId,
        campaignId: "5f89dd4c3d90afc740368088",
      },
    });
  }
}
