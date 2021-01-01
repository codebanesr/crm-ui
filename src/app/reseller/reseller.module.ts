import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserQuotaDialog, ResellerOrganizationList, ResellerTransactionModal } from './reseller-organization-list/reseller-organization-list.component';
import { CreateResellerComponent } from './create-reseller/create-reseller.component';
import { DemoMaterialModule } from '../material/material.module';
import { ResellerRoutingModule } from './reseller-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
@NgModule({
  declarations: [
    ResellerOrganizationList,
    CreateResellerComponent,
    AddUserQuotaDialog,
    ResellerTransactionModal
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    ResellerRoutingModule
  ],
})
export class ResellerModule { }
