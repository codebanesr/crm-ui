import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class GraphService {
    constructor(private http: HttpClient) {}


    getGraphData(payload): Observable<Object> {
        return this.http.post(`${environment.apiUrl}/lead-analytic/graphData`, payload);
    }
}
