import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrdersService } from "./orders.service";
import { PaymentComponent } from "./orders/payment.component";
import { OrdersRoutingModule } from "./orders-routing.module";
import { DemoMaterialModule } from "../material/material.module";
import { OrdersComponent } from "./orders/orders.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [PaymentComponent, OrdersComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [OrdersService],
})
export class OrdersModule {}
