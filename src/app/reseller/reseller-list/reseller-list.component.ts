import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/home/users.service';
import { ResellerOrganization } from './reseller-organization.interface';
import * as moment from "moment";
import { OrganizationService } from 'src/app/organization.service';




@Component({
  selector: 'app-reseller-list',
  templateUrl: './reseller-list.component.html',
  styleUrls: ['./reseller-list.component.scss'],
})
export class ResellerOrganizationList implements OnInit {

  constructor(
    private userService: UsersService,
    public dialog: MatDialog
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


interface IRowData {
  createdAt: Date,
  credit: number,
  orgId: string,
  orgName: string,
  resellerId: string,
  resellerName: string,
  updatedAt: Date,
  __v: number,
  _id: string
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

  ngOnInit() {
    this.initActivationForm();
  }


  activationForm: FormGroup;
  perUserRate = new FormControl(1500, []);
  discount = new FormControl(20, []);
  seats = new FormControl(5, []);
  total = new FormControl({value: 0, disabled: true}, []);
  months = new FormControl(1, [])
  
  initActivationForm() {
    // value change wont be fired first time
    this.calculateTotalPrice();
    this.activationForm = this.fb.group({
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


  calculateTotalPrice() {
    const discount = this.discount.value;
    const perUserRate = this.perUserRate.value;
    const seats = this.seats.value;
    const months = this.months.value;

    const total = perUserRate * (1-0.01*discount) * seats * months;
    this.total.setValue(total);
  }


  handleActivationFormSubmit() {  
    this.organizationService.updateOrganizationQuota(this.activationForm.value);
  }
}