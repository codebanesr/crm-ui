import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GraphsComponent } from "./graphs/graphs.component";import { InteractionComponent } from "./interaction/pie.component";
import { LocationTrackerComponent } from "./location-tracker/location-tracker.component";

const routes: Routes = [
  {
    path: "tracker",
    pathMatch: 'full',
    component: LocationTrackerComponent
  },
  {
    path: 'graphs',
    pathMatch: 'full',
    component: GraphsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
