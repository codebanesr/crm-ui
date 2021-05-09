import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Organization } from "src/app/home/interfaces/global.interfaces";
import { OrganizationService } from "src/app/organization.service";
import { OrdersService } from "../orders.service";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    private orderService: OrdersService,
    private organizationService: OrganizationService,
    private router: Router
  ) {}

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

  data: Organization;
  async ngOnInit() {
    this.data = await this.organizationService
      .getCurrentOrganization()
      .toPromise();

    this.initActivationForm();
  }

  activationForm: FormGroup;
  perUserRate = new FormControl(500, []);
  discount = new FormControl(10, [Validators.required]);
  seats = new FormControl(5, [Validators.required]);
  total = new FormControl({ value: 0, disabled: true }, [Validators.required]);
  months = new FormControl(1, [Validators.required]);
  organization = new FormControl({ value: "", disabled: true }, [
    Validators.required,
  ]);

  initActivationForm() {
    this.organization.setValue(this.data._id);
    // value change wont be fired first time
    this.calculateTotalPrice();
    this.organization.setValue(this.data._id);
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

  async handleActivationFormSubmit() {
    const result = await this.orderService
      .createOrder({
        amount: this.total.value * 100,
        currency: "INR",
        notes: this.activationForm.value,
      })
      .toPromise();

    // once an order has been confirmed route to PaymentComponent
    this.router.navigate(["orders", "payment", result.id], {
      queryParams: result,
    });
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
