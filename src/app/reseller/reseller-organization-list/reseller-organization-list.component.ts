import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/home/users.service';
import { ResellerOrganization } from './reseller-organization.interface';
import * as moment from "moment";
import { OrganizationService } from 'src/app/organization.service';
import { IRowData, ITransaction } from './organization-list.interfaces';

@Component({
  selector: 'app-reseller-organization-list',
  templateUrl: './reseller-organization-list.component.html',
  styleUrls: ['./reseller-organization-list.component.scss'],
})
export class ResellerOrganizationList implements OnInit {

  constructor(
    private userService: UsersService,
    public dialog: MatDialog,
    public organizationService: OrganizationService,
  ) { }

  resellerOrganizations: ResellerOrganization[];
  ngOnInit() {
    this.populateResellerOrganizations();
  }

  isLoadingResults = false;
  resultsLength = 100;
  displayedColumns: string[] = ['name', 'credit', 'createdAt', 'updatedAt', '_v'];
  populateResellerOrganizations() {
    this.isLoadingResults = true;
    this.userService.getAllResellerOrganizations().subscribe((result: any)=>{
      this.isLoadingResults = false;
      this.resellerOrganizations = result;
    }, error=>{
      this.isLoadingResults = false;
    })
  }

  transactions: ITransaction[] = [];
  getAllTransactions(data: any) {
    console.log(data);
    this.organizationService.getAllTransactions(data.orgId).subscribe((result: ITransaction[])=>{
      this.transactions = result;
      this.openResellerTransactionModal();
    }, error=>{
      console.log(error);
    });

  }

  openResellerTransactionModal() {
    const dialogRef = this.dialog.open(ResellerTransactionModal, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: this.transactions
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log("dialog closed", result);
    });
  }

  openAddUserQuota(rowData): void {
    console.log(rowData)
    const dialogRef = this.dialog.open(AddUserQuotaDialog, {
      width: '250px',
      data: rowData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }
}

@Component({
  selector: 'reseller-add-user-quota-dialog',
  templateUrl: 'add-user-quota.html',
})
export class AddUserQuotaDialog implements OnInit{

  constructor(
      public dialogRef: MatDialogRef<AddUserQuotaDialog>,
      public fb: FormBuilder,
      private organizationService: OrganizationService,
      @Inject(MAT_DIALOG_DATA) public data: IRowData
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addUserQuota() {
    this.organizationService.updateOrganizationQuota(this.activationForm.getRawValue()).subscribe(data=>{
      console.log(data);
    }, error=>{
      console.log(error);
    })
  }

  ngOnInit() {
    this.initActivationForm();
  }

  activationForm: FormGroup;
  perUserRate = new FormControl(1500, []);
  discount = new FormControl(20, [Validators.required]);
  seats = new FormControl(5, [Validators.required]);
  total = new FormControl({value: 0, disabled: true}, [Validators.required]);
  months = new FormControl(1, [Validators.required])
  organization = new FormControl({value: this.data.orgId, disabled: true}, [Validators.required])  
  initActivationForm() {
    // value change wont be fired first time
    this.calculateTotalPrice();
    this.activationForm = this.fb.group({
      organization: this.organization,
      perUserRate: this.perUserRate,
      discount: this.discount,
      seats: this.seats,
      total: this.total,
      months: this.months
    })

    this.perUserRate.valueChanges.subscribe(data=>{
      this.calculateTotalPrice();
    });

    this.discount.valueChanges.subscribe(data=>{
      this.calculateTotalPrice();
    });

    this.seats.valueChanges.subscribe(data=>{
      this.calculateTotalPrice();
    });

    this.months.valueChanges.subscribe(data=>{
      console.log(moment().add(data, 'M'))
      this.calculateTotalPrice();
    })
  }

  handleActivationFormSubmit() {
    console.log("is this in use")
  }

  calculateTotalPrice() {
    const discount = this.discount.value;
    const perUserRate = this.perUserRate.value;
    const seats = this.seats.value;
    const months = this.months.value;

    const total = perUserRate * (1-0.01*discount) * seats * months;
    this.total.setValue(total);
  }
}


@Component({
  selector: 'reseller-transaction-modal',
  templateUrl: 'reseller-transaction-modal.html',
  styles: [`
    table {
      width: 100%;
    }
    .mat-column-filler {
      padding: 0 8px;
      font-size: 10px;
      text-align: center;
    }
    
    .mat-header-cell, .mat-footer-cell, .mat-cell {
      min-width: 80px;
      box-sizing: border-box;
    }
    
    .mat-header-row, .mat-footer-row, .mat-row {
      min-width: 1920px; /* 24 columns, 80px each */
    }`
  ]
})
export class ResellerTransactionModal implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<ResellerTransactionModal>,
    @Inject(MAT_DIALOG_DATA) public transactions: ITransaction[]
  ) {}

  displayedColumns: string[] = ['seats', 'perUserRate', 'discount', 'total', 'expiresOn'];
  ngOnInit() {
    console.log(this.transactions);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

