import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DataTableComponent } from "./data-table/data-table.component";
import { GraphsComponent } from "./graphs/graphs.component";
import { InteractionComponent } from "./interaction/pie.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
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
  },{
    path: 'lineChart',
    pathMatch: 'full',
    component: LineChartComponent
  }, {
    path: 'dataTable',
    pathMatch: 'full',
    component: DataTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
