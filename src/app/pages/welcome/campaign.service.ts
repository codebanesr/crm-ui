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
    sortField: string | null,
    sortOrder: string | null,
  ) {
    let params = new HttpParams()
    .append('page', `${pageIndex}`)
    .append('perPage', `${pageSize}`)
    .append('sortField', `${sortField}`)
    .append('sortOrder', `${sortOrder}`);

    return this.http.get("http://testingdomain.com:3000/campaign", {params});
  }


  getHandlerEmailHints(partialEmail: string) {
    let params = new HttpParams()
      .append('partialEmail', `${partialEmail}`)
    return this.http.get("http://testingdomain.com:3000/campaign/autocomplete/suggestEmails", {params});
  }
}
