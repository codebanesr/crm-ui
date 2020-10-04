import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILeadColumn } from './leads/lead.interface';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http: HttpClient) { }

  getLeads(options): Observable<{ results: any[] }> {
    return this.http.post<{ results: any[] }>(`${environment.apiUrl}/lead/findAll`, options);
  }

  addLead(body) {
    return this.http.post(`${environment.apiUrl}/lead`, body);
  }


  getAllLeadColumns(campaignType?: string) {
    let reqUrl = `${environment.apiUrl}/lead/getAllLeadColumns`;
    if (campaignType) {
      reqUrl += `?campaignType=${campaignType}`;
    }
    return this.http.get(reqUrl);
  }


  updateLead(leadId, body) {
    return this.http.put(`${environment.apiUrl}/lead/${leadId}`, body);
  }


  getLeadById(leadId: string) {
    return this.http.get(`${environment.apiUrl}/lead/${leadId}`);
  }


  reassignLead(oldUserEmail, newUserEmail, lead) {
    return this.http.post(`${environment.apiUrl}/lead/reassignLead`, { oldUserEmail, newUserEmail, lead });
  }


  getHistoryForLead(externalId) {
    return this.http.get(`${environment.apiUrl}/lead/getLeadHistoryById/${externalId}`);
  }


  getBasicOverview() {
    return this.http.get(`${environment.apiUrl}/lead/basicOverview`);
  }

  suggestLead(leadId) {
    return this.http.get(`${environment.apiUrl}/lead/suggest/${leadId}`);
  }


  getLeadMappings(campaignName?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const showCols = [];
      this.getAllLeadColumns(campaignName).subscribe((mSchema: { paths: ILeadColumn[] }) => {
        mSchema.paths.forEach((path: ILeadColumn) => {
          showCols.push({
            label: path.readableField,
            value: path.internalField,
            checked: path.checked,
            type: path.type,
            options: path.options
          });
        });
        const typeDict = Object.assign({}, ...showCols.map((x) => ({ [x.value]: x })));
        resolve({ typeDict, mSchema });
      }, error => {
          reject({ error: "something went wrong in leads service" });
      })
    })
  }

  fetchNextLead(campaignName: string, leadStatus: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/lead/fetchNextLead/${campaignName}/${leadStatus}`);
  }
}
