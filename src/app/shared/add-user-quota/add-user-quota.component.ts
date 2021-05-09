import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";
import { OrganizationService } from "src/app/organization.service";
import { IRowData } from "src/app/reseller/reseller-organization-list/organization-list.interfaces";

@Component({
  selector: "reseller-add-user-quota-dialog",
  templateUrl: "add-user-quota.html",
})
export class AddUserQuotaDialog implements OnInit {
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
    this.organizationService
      .updateOrganizationQuota(this.activationForm.getRawValue())
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.initActivationForm();
  }

  activationForm: FormGroup;
  perUserRate = new FormControl(1500, []);
  discount = new FormControl(20, [Validators.required]);
  seats = new FormControl(5, [Validators.required]);
  total = new FormControl({ value: 0, disabled: true }, [Validators.required]);
  months = new FormControl(1, [Validators.required]);
  organization = new FormControl({ value: this.data.orgId, disabled: true }, [
    Validators.required,
  ]);
  
  initActivationForm() {
    // value change wont be fired first time
    this.calculateTotalPrice();
    this.activationForm = this.fb.group({
      organization: this.organization,
      perUserRate: this.perUserRate,
      discount: this.discount,
      seats: this.seats,
      total: this.total,
      months: this.months,
    });

    this.perUserRate.valueChanges.subscribe((data) => {
      this.calculateTotalPrice();
    });

    this.discount.valueChanges.subscribe((data) => {
      this.calculateTotalPrice();
    });

    this.seats.valueChanges.subscribe((data) => {
      this.calculateTotalPrice();
    });

    this.months.valueChanges.subscribe((data) => {
      console.log(moment().add(data, "M"));
      this.calculateTotalPrice();
    });
  }

  handleActivationFormSubmit() {
    console.log("is this in use");
  }

  calculateTotalPrice() {
    const discount = this.discount.value;
    const perUserRate = this.perUserRate.value;
    const seats = this.seats.value;
    const months = this.months.value;

    const total = perUserRate * (1 - 0.01 * discount) * seats * months;
    this.total.setValue(total);
  }
}
