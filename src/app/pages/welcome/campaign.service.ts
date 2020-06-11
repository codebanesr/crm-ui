import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private http: HttpClient) { }

  getCampaigns(
    pageIndex: number,
    pageSize: number,
    filters: any,
    sortField: string | null,
    sortOrder: string | null,
  ) {
    let body = {
      pageIndex,
      pageSize,
      filters,
      sortField: sortField,
      sortOrder: sortOrder
    }
    return this.http.post("http://testingdomain.com:3000/campaign/get", body);
  }


  getHandlerEmailHints(partialEmail: string) {
    let params = new HttpParams()
      .append('partialEmail', `${partialEmail}`)
    return this.http.get("http://testingdomain.com:3000/campaign/autocomplete/suggestEmails", {params});
  }


  getAllCampaignTypes() {
    return this.http.get("http://testingdomain.com:3000/campaign/autocomplete/suggestTypes");
  }
}
