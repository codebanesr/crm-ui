import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TelecallerLcTableComponent } from "./telecaller-lc-table/telecaller-lc-table.component";
import { GraphsComponent } from "./graphs/graphs.component";
import { InteractionComponent } from "./interaction/pie.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { LocationTrackerComponent } from "./location-tracker/location-tracker.component";
import { CampaignReportContainerComponent } from "./campaign-report-container/campaign-report-container.component";

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
    path: 'campaignReports',
    pathMatch: 'full',
    component: CampaignReportContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
