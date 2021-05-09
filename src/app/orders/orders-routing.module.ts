import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrdersComponent } from "./orders/orders.component";
import { PaymentComponent } from "./orders/payment.component";

const routes: Routes = [
  {
    path: "payment/:order_id",
    component: PaymentComponent,
    pathMatch: "full",
  },
  {
    path: "placeOrder",
    component: OrdersComponent,
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
