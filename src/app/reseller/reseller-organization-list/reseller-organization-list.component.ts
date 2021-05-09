import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { UsersService } from "src/app/home/users.service";
import { ResellerOrganization } from "./reseller-organization.interface";
import * as moment from "moment";
import { OrganizationService } from "src/app/organization.service";
import { IRowData, ITransaction } from "./organization-list.interfaces";
import { AddUserQuotaDialog } from "src/app/shared/add-user-quota/add-user-quota.component";

@Component({
  selector: "app-reseller-organization-list",
  templateUrl: "./reseller-organization-list.component.html",
  styleUrls: ["./reseller-organization-list.component.scss"],
})
export class ResellerOrganizationList implements OnInit {
  constructor(
    private userService: UsersService,
    public dialog: MatDialog,
    public organizationService: OrganizationService
  ) {}

  resellerOrganizations: ResellerOrganization[];
  ngOnInit() {
    this.populateResellerOrganizations();
  }

  isLoadingResults = false;
  resultsLength = 100;
  displayedColumns: string[] = [
    "name",
    "credit",
    "createdAt",
    "updatedAt",
    "_v",
  ];
  populateResellerOrganizations() {
    this.isLoadingResults = true;
    this.userService.getAllResellerOrganizations().subscribe(
      (result: any) => {
        this.isLoadingResults = false;
        this.resellerOrganizations = result;
      },
      (error) => {
        this.isLoadingResults = false;
      }
    );
  }

  transactions: ITransaction[] = [];
  getAllTransactions(data: any) {
    console.log(data);
    this.organizationService.getAllTransactions(data.orgId).subscribe(
      (result: ITransaction[]) => {
        this.transactions = result;
        this.openResellerTransactionModal();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openResellerTransactionModal() {
    const dialogRef = this.dialog.open(ResellerTransactionModal, {
      maxWidth: "100vw",
      maxHeight: "100vh",
      height: "100%",
      width: "100%",
      data: this.transactions,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("dialog closed", result);
    });
  }

  openAddUserQuota(rowData): void {
    console.log(rowData);
    const dialogRef = this.dialog.open(AddUserQuotaDialog, {
      width: "250px",
      data: rowData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      console.log(result);
    });
  }
}

@Component({
  selector: "reseller-transaction-modal",
  templateUrl: "reseller-transaction-modal.html",
  styles: [
    `
      table {
        width: 100%;
      }
      .mat-column-filler {
        padding: 0 8px;
        font-size: 10px;
        text-align: center;
      }

      .mat-header-cell,
      .mat-footer-cell,
      .mat-cell {
        min-width: 80px;
        box-sizing: border-box;
      }

      .mat-header-row,
      .mat-footer-row,
      .mat-row {
        min-width: 1920px; /* 24 columns, 80px each */
      }
    `,
  ],
})
export class ResellerTransactionModal implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ResellerTransactionModal>,
    @Inject(MAT_DIALOG_DATA) public transactions: ITransaction[]
  ) {}

  displayedColumns: string[] = [
    "seats",
    "perUserRate",
    "discount",
    "total",
    "expiresOn",
  ];
  ngOnInit() {
    console.log(this.transactions);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
