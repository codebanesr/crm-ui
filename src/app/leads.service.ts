import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILead } from 'src/interfaces/leads.interface';
import { ICampaign, ILeadColumn } from './pages/welcome/leads/lead.interface';

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


  getAllLeadColumns() {
    return this.http.get(`${environment.apiUrl}/lead/getAllLeadColumns`);
  }


  updateLead(leadId, body) {
    return this.http.put(`${environment.apiUrl}/lead/${leadId}`, {lead: body});
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


  getLeadMappings(): Promise<any> {
    return new Promise((resolve, reject) => {
      const showCols = [];
      this.getAllLeadColumns().subscribe((mSchema: { paths: ILeadColumn[] }) => {
        mSchema.paths.forEach((path: ILeadColumn) => {
          showCols.push({
            label: path.readableField,
            value: path.internalField,
            checked: path.checked,
            type: path.type
          });
        });
        const typeDict = Object.assign({}, ...showCols.map((x) => ({ [x.value]: x })));
        resolve({ typeDict, mSchema });
      }, error => {
          reject({ error: "something went wrong in leads service" });
      })
    })
  }


  getSingleLeadByDispositionAndCampaign(dispositionType: string, campaignId: string): Observable<ILead> {
    return of({
        _id : '5f26bf151d9cccc34b3559d0',
        externalId : 'mlohden1@soup.io',
        __v : 0,
        address : '0 Homewood Drive',
        amount : '¥50917.27',
        campaign : 'core',
        companyName : 'AbbVie Inc.',
        createdAt : '2020-08-02T17:26:47.365+04:00',
        customerEmail : 'mlohden1@bbb.org',
        email : 'frontline1@email.com',
        firstName : 'Muhammad',
        followUp : '2020-03-28T04:00:00.000+04:00',
        lastName : 'Lohden',
        leadStatus : 'Blue',
        phoneNumber : '88132',
        phoneNumberPrefix : '1756',
        product : 'Pepper - Black, Crushed',
        remarks : '0.0607950874',
        source : 'NYSE',
        updatedAt : '2020-08-02T17:26:47.365+04:00'
    });
    // return this.http.get(`${environment.apiUrl}/lead/singleLeadByDisposition/${dispositionType}`);
  }
}
