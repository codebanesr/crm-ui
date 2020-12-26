import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateResellerComponent } from "./create-reseller/create-reseller.component";
import { ResellerOrganizationList } from "./reseller-list/reseller-list.component";

const routes: Routes = [
  {
    path: "create",
    pathMatch: 'full',
    component: CreateResellerComponent
  }, {
    path: "organization/list",
    pathMatch: 'full',
    component: ResellerOrganizationList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResellerRoutingModule {}
