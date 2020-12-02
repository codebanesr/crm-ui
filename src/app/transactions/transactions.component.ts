import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CampaignService } from "../home/campaign.service";
import { ILead } from "../home/interfaces/leads.interface";
import { LeadSoloComponent } from "../home/lead-solo/lead-solo.component";
import { LeadsService } from "../home/leads.service";

interface IHistory {
  oldUser: string;
  newUser: string;
  lead: string;
  campaignName: string;
  prospectName: string;
  phoneNumber: string;
  followUp: String;
  direction: String;
  notes: string;
  callRecordUrl: string;
  geoLocation: { coordinates: string[] };
  leadStatus: string;
  attachment: string;
  requestedInformation?: { [key: string]: string }[];
  active: boolean;
  createdAt: string;
  nextAction?: string;
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
  objectKeys = Object.keys;
  ngOnInit() {
    this.getTransactions();
  }

  getTransactions() {
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

  leadMapping = {
    geoLocation: "Location",
    createdAt: "Created At",
    _id: "Transaction Id",
    lead: "Lead Id",
    notes: "Notes",
    newUser: "Assigned To",
    prospectName: "Name",
    leadStatus: "Status",
    followUp: "Scheduled",
    nextAction: "Action",
  };

  handlePageChange(page: number) {
    this.pagination.page = page;
    this.getTransactions();
  }
}
