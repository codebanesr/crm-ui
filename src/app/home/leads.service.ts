import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ICampaign } from "../campaign/campaign.interface";
import { ILead } from "./interfaces/leads.interface";
import { ILeadColumn } from "./leads/lead.interface";

export enum INTERVAL {
  "TODAY" = "TODAY",
  "THIS_WEEK" = "THIS_WEEK",
  "THIS_MONTH" = "THIS_MONTH",
}

@Injectable({
  providedIn: "root",
})
export class LeadsService {
  constructor(private http: HttpClient) {}

  getLeads(options: {
    campaignId: string;
    page: number;
    perPage: number;
    showCols?: string[];
    searchTerm: string;
    filters?: any;
  }): Observable<{data: ILead[], total: number, page: number}> {
    return this.http.post<{data: ILead[], total: number, page: number}>(
      `${environment.apiUrl}/lead/findAll`,
      options
    );
  }

  addLead(body) {
    return this.http.post(`${environment.apiUrl}/lead`, body);
  }

  getAllLeadColumns(campaignId: string, remove?: Partial<keyof ILead>[]) {
    let reqUrl = `${environment.apiUrl}/lead/getAllLeadColumns/${campaignId}`;
    return this.http.get(reqUrl, {params: {remove}});
  }

  updateLead(
    leadId,
    body: { campaignId: string, geoLocation: any; lead: any; reassignmentInfo?: any }
  ) {
    return this.http.put(`${environment.apiUrl}/lead/${leadId}`, body);
  }

  getLeadById(leadId: string) {
    return this.http.get(`${environment.apiUrl}/lead/${leadId}`);
  }

  reassignLead(oldUserEmail, newUserEmail, lead) {
    return this.http.post(`${environment.apiUrl}/lead/reassignLead`, {
      oldUserEmail,
      newUserEmail,
      lead,
    });
  }

  getHistoryForLead(externalId) {
    return this.http.get(
      `${environment.apiUrl}/lead/getLeadHistoryById/${externalId}`
    );
  }

  getBasicOverview() {
    return this.http.get(`${environment.apiUrl}/lead/basicOverview`);
  }

  suggestLead(leadId) {
    return this.http.get(`${environment.apiUrl}/lead/suggest/${leadId}`);
  }

  async getLeadMappings(
    campaignName: string = null,
    preventFields: Partial<keyof ILead>[] = ['createdAt', '__v', 'campaignId', 'updatedAt', 'email', 'leadStatus']
  ): Promise<{ typeDict: { [x: string]: any }; mSchema: { paths: any[] } }> {
    return new Promise((resolve, reject) => {
      const showCols = [];
      this.getAllLeadColumns(campaignName, preventFields).subscribe(
        (mSchema: { paths: ILeadColumn[] }) => {
          mSchema.paths.forEach((path: ILeadColumn) => {
            showCols.push({
              label: path.readableField,
              value: path.internalField,
              checked: path.checked,
              type: path.type,
              options: path.options,
            });
          });
          const typeDict = Object.assign(
            {},
            ...showCols.map((x) => ({ [x.value]: x }))
          );
          resolve({ typeDict, mSchema });
        },
        (error) => {
          reject({ error: "something went wrong in leads service" });
        }
      );
    });
  }

  fetchNextLead(
    campaignName: string,
    typeDict: {
      [key: string]: { label: string; value: string; options?: any };
    },
    filters: Map<string, string>,
    nonKeyFilters: Map<string, string>
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/lead/fetchNextLead/${campaignName}`,
      { filters, typeDict, nonKeyFilters }
    );
  }

  getFollowUps({
    page,
    perPage,
    campaignId,
    interval,
    userEmail,
  }: {
    campaignId?: string;
    interval?: string[];
    userEmail?: string;
    page: number;
    perPage: number;
  }) {
    return this.http.post(`${environment.apiUrl}/lead/followUp`, {
      campaignId,
      interval,
      userEmail,
      page,
      perPage,
    });
  }

  addContact(
    leadId: string,
    contact: { label: string; value: string; type: string }
  ) {
    return this.http.put(
      `${environment.apiUrl}/lead/contact/${leadId}`,
      contact
    );
  }

  createLead(lead, campaignId: string, campaignName: string) {
    return this.http.post(
      `${environment.apiUrl}/lead/create/${campaignId}/${campaignName}`,
      {lead}
    );
  }

  downloadAllTransactions( pagination: {
      page: number;
      perPage: number;
      sortBy: string;
      sortOrder: string;
    },
    filters: any
  ) {
    const url = `${environment.apiUrl}/lead/transactions?isStreamable=true`;
    this.http.post(url, {pagination, filters},{responseType: 'arraybuffer'}).subscribe(data=>{
      const blob = new Blob([data], {type: 'application/octet-stream'});
      saveAs(blob, "transactions.xlsx");
    })
  }


  getTransactions(
    pagination: {
      page: number;
      perPage: number;
      sortBy: string;
      sortOrder: string;
    },
    filters: any
  ) {
    return this.http.post(`${environment.apiUrl}/lead/transactions`, {
      pagination,
      filters,
    });
  }
}
