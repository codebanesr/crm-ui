import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: HttpClient) {}

  createOrganizationAndAdmin(createOrganizationDto) {
    return this.http.post(
      `${environment.apiUrl}/organization`,
      createOrganizationDto
    );
  }

  isAttributeValid(payload: {
    label: string;
    value: string;
  }) {
    return this.http.post(
      `${environment.apiUrl}/organization/isValid`,
      payload
    );
  }



  generateAndReceiveOtp(phoneNumber: string) {
    return this.http.post(`${environment.apiUrl}/organization/otp`, {
      "mobileNumber": phoneNumber
    });
  }
  

  updateOrganizationQuota(quotaObj) {
    return this.http.post(`${environment.apiUrl}/organization/quota`, quotaObj);
  }


  getAllTransactions(organization: string) {
    return this.http.get(`${environment.apiUrl}/organization/transactions?organization=${organization}`);
  }
}
