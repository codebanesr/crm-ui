import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }


  getAggregatedLeadStatus(dateArray) {
    return this.http.post(`${environment.apiUrl}/dashboard/leadStatus`, {dateArray});
  }


  getLeadStatusByDepartment(dateArray) {
    return this.http.post(`${environment.apiUrl}/dashboard/leadStatus/department`, {dateArray});
  }
}
