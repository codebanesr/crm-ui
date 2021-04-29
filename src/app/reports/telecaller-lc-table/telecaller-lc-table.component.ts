import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { merge, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { GraphService } from "../graphs/graphs.service";
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

  // leadclosed
  data: TelecallerLcTableComponent[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  totalLeads = 0;
  ngOnInit() {}

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.graphService.getOpenClosedLeadCount(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          );
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;
          this.totalLeads = data.totalLeadsInOrg;
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
