import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { merge, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { GraphService } from "../reports/graphs/graphs.service";
import { TelecallerLcTableItem } from "./telecallerLc.interface";

@Component({
  selector: "app-telecaller-lc-table",
  templateUrl: "./telecaller-lc-table.component.html",
  styleUrls: ["./telecaller-lc-table.component.css"],
})
export class TelecallerLcTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TelecallerLcTableItem>;

  constructor(private graphService: GraphService) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["email", "totalOpen", "totalClosed"];

  barData: any[];

  // leadclosed
  data: TelecallerLcTableComponent[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;


  stackBarTitle = 'Category Wise Lead Count / Campaign';
  XAxisLabel = 'Campaign Name';
  YAxisLabel = 'Total Leads';
  stackBarData = null;
  max = 50;

  ngOnInit() {}

  ngAfterViewInit() {

    this.graphService.campaignWiseLeadCount().subscribe(data=>{
      this.barData = data;
    });


    this.graphService.campaignWiseLeadCountPerCategory().subscribe(data=>{
      this.XAxisLabel = data.XAxisLabel;
      this.YAxisLabel = data.YAxisLabel;

      this.max = data.max;
      this.stackBarData = data.stackBarData;
    })

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.graphService.getOpenClosedLeadCount(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex
          );
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          console.log(data.items);
          return data.items;
        }),
        catchError(() => {
          console.log("Error occured");
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe((data: any) => {
        this.data = data;
      });
  }
}
