import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TelecallerLcTableItem } from "src/app/telecaller-lc-table/telecallerLc.interface";
import { environment } from "src/environments/environment";

@Injectable()
export class GraphService {
    constructor(private http: HttpClient) {}


    getGraphData(payload): Observable<Object> {
        return this.http.post(`${environment.apiUrl}/lead-analytic/graphData`, payload);
    }


    getLeadStatusLineData(year=2021) {
      return this.http.get(`${environment.apiUrl}/lead-analytic/leadStatusLineData?year=${year}`);
    }


    getOpenClosedLeadCount(active: string, direction: string, pageIndex: number) {
      return this.http.get<{items: TelecallerLcTableItem[], total_count: number}>(`${environment.apiUrl}/lead-analytic/openClosedLeadCount`);
    }

    // campaignWiseLeadCount
    campaignWiseLeadCount() {
      return this.http.get<{
        type: string;
        value: number;
        percent: number;
      }[]>(`${environment.apiUrl}/lead-analytic/campaignWiseLeadCount`);
    }

    campaignWiseLeadCountPerCategory() {
      return this.http.get<{XAxisLabel: string,YAxisLabel: string, stackBarData: any[], max: number }>(`${environment.apiUrl}/lead-analytic/campaignWiseLeadCountPerCategory`);
    }
}
