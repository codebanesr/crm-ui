import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http: HttpClient) { }

  getLeads(options): Observable<{ results: any[] }> {
    return this.http.post<{ results: any[] }>(`${environment.apiUrl}/lead`,  options);
  }

  addLead(body) {
    return this.http.post(`${environment.apiUrl}/lead`, body);
  }


  getAllLeadColumns() {
    return this.http.get(`${environment.apiUrl}/lead/getAllLeadColumns`);
  }


  updateLead(leadId, body) {
    return this.http.put(`/api/lead/${leadId}`, body);
  }


  getLeadById(leadId: string) {
    return this.http.get(`${environment.apiUrl}/lead/${leadId}`)
  }
}
