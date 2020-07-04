import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';



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
    return this.http.post(`${environment.apiUrl}/campaign/get`, body);
  }


  getHandlerEmailHints(partialEmail: string) {
    let params = new HttpParams()
      .append('partialEmail', `${partialEmail}`)
    return this.http.get(`${environment.apiUrl}/campaign/autocomplete/suggestEmails`, {params});
  }


  getAllCampaignTypes(hint?: string | undefined) {
    return this.http.get(`${environment.apiUrl}/campaign/autocomplete/suggestTypes?hint=${hint}`);
  }

  getAllEmailTemplates(props: {campaign: string}) {
    return this.http.get(`${environment.apiUrl}/lead/getAllEmailTemplates?campaign=${props.campaign}`);
  }

  createEmailTemplate(emailTemplate) {
    return this.http.post(`${environment.apiUrl}/lead/getAllEmailTemplates`, emailTemplate);
  }

  handleFilesUpload(formData) {
    const req = new HttpRequest('POST', `${environment.apiUrl}/lead/saveAttachments`, formData, {
      // reportProgress: true
    });
    return this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
  }



  handleMultipleLeadFileUpload(formData) {
    const req = new HttpRequest('POST', `${environment.apiUrl}/lead/uploadMultipleLeadFiles`, formData, {
      // reportProgress: true
    });
    return this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
  }

  handleEmailTemplateUpload(emailTemplate) {
    return this.http.post(`${environment.apiUrl}/lead/createEmailTemplate`, emailTemplate);
  }


  uploadCampaignFile(formData) {
    const req = new HttpRequest('POST', `${environment.apiUrl}/campaign/config/upload`, formData, {
      // reportProgress: true
    });
    return this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
  }
}
