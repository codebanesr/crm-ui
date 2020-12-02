import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Inject } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { ILead } from "../interfaces/leads.interface";
import { LeadsService } from "../leads.service";

export class MyDataSource extends DataSource<ILead | undefined> {
  private _length = 100000;
  private _pageSize = 100;
  private _cachedData = Array.from<ILead>({ length: this._length });
  private _fetchedPages = new Set<number>();
  private _dataStream = new BehaviorSubject<(ILead | undefined)[]>(
    this._cachedData
  );
  private _subscription = new Subscription();

  constructor(private leadService: LeadsService) {
    super();
  }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<(ILead | undefined)[]> {
    this._subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        const startPage = this._getPageForIndex(range.start);
        const endPage = this._getPageForIndex(range.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this._fetchPage(i);
        }
      })
    );
    return this._dataStream;
  }

  disconnect(): void {
    this._subscription.unsubscribe();
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _fetchPage(page: number) {
    if (this._fetchedPages.has(page)) {
      return;
    }
    this._fetchedPages.add(page);

    // Use `setTimeout` to simulate fetching data from server.
    // setTimeout(() => {
    //   this._cachedData.splice(
    //     page * this._pageSize,
    //     this._pageSize,
    //     ...Array.from({ length: this._pageSize }).map(
    //       (_, i) => `Item #${page * this._pageSize + i}`
    //     )
    //   );
    //   this._dataStream.next(this._cachedData);
    // }, Math.random() * 1000 + 200);
    this.leadService
      .getLeads({
        page: 1,
        perPage: 15,
        searchTerm: "",
      })
      .subscribe(
        async (response: any) => {
          if (response.data.length === 0) {
            return;
          } else {
            // this.leads = response.data;
            // this.total = response.total;
            this._dataStream.next(response.data);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
