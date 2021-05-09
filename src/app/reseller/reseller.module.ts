import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ResellerOrganizationList,
  ResellerTransactionModal,
} from "./reseller-organization-list/reseller-organization-list.component";
import { CreateResellerComponent } from "./create-reseller/create-reseller.component";
import { DemoMaterialModule } from "../material/material.module";
import { ResellerRoutingModule } from "./reseller-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "../shared/shared.module";
@NgModule({
  declarations: [
    ResellerOrganizationList,
    CreateResellerComponent,
    ResellerTransactionModal,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    SharedModule,
    ResellerRoutingModule,
  ],
})
export class ResellerModule {}
