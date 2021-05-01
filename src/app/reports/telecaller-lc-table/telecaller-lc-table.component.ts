import { Component, ViewChild, AfterViewInit, OnInit, Input, OnChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";
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
export class TelecallerLcTableComponent implements OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TelecallerLcTableItem>;

  constructor(private graphService: GraphService) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["email", "totalOpen", "totalClosed"];

  // leadclosed
  @Input() data: TelecallerLcTableItem[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  totalLeads = 0;

  ngOnChanges() {}
}
