import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http: HttpClient) { }

  getLeads(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
  ): Observable<{ results: any[] }> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('perPage', `${pageSize}`)
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`);
    return this.http.get<{ results: any[] }>(`${environment.apiUrl}/lead`, { params });
  }

  addLead(body) {
    return this.http.post(`${environment.apiUrl}/lead`, body);
  }


  updateLead(leadId, body) {
    return this.http.put(`/api/lead/${leadId}`, body);
  }


  getLeadById(leadId: string) {
    return this.http.get(`${environment.apiUrl}/lead/${leadId}`)
  }
}
