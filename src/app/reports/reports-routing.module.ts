import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LocationTrackerComponent } from "./location-tracker/location-tracker.component";

const routes: Routes = [
  {
    path: "tracker",
    pathMatch: 'full',
    component: LocationTrackerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
