import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TelecallerLcTableItem } from "src/app/reports/telecaller-lc-table/telecallerLc.interface";
import { environment } from "src/environments/environment";

@Injectable()
export class GraphService {
    constructor(private http: HttpClient) {}


    getGraphData(payload): Observable<Object> {
        return this.http.post(`${environment.apiUrl}/lead-analytic/graphData`, payload);
    }


    getLeadStatusLineData(year=2021) {
      return this.http.post(`${environment.apiUrl}/lead-analytic/leadStatusLineData?year=${year}`, {});
    }


    getOpenClosedLeadCount(filters) {
      return this.http.post<{
        items: TelecallerLcTableItem[];
        total_count: number;
        totalLeadsInOrg: number;
      }>(`${environment.apiUrl}/lead-analytic/openClosedLeadCount?${filters}`, filters);
    }

    // campaignWiseLeadCount
    campaignWiseLeadCount(payload) {
      return this.http.post<{
        type: string;
        value: number;
        percent: number;
      }[]>(`${environment.apiUrl}/lead-analytic/campaignWiseLeadCount`, payload);
    }

    campaignWiseLeadCountPerCategory(payload) {
      return this.http.post<{XAxisLabel: string,YAxisLabel: string, stackBarData: any[], max: number }>(`${environment.apiUrl}/lead-analytic/campaignWiseLeadCountPerCategory`, payload);
    }

}
