import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "./interfaces/user";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(
    page: number,
    perPage: number,
    sortField: string | null,
    sortOrder: string | null,
    filters?: Array<{ key: string; value: string[] }>
  ): Observable<{ results: User[] }> {
    // filters.forEach(filter => {
    //   filter.value.forEach(value => {
    //     params = params.append(filter.key, value);
    //   });
    // });
    return this.http.post<{ results: User[] }>(
      `${environment.apiUrl}/user/allUsers`,
      { page, perPage, sortField, sortOrder, filters}
    );
  }

  getAllUsersHack() {
    return this.http.get<{ results: User[] }>(`${environment.apiUrl}/user`);
  }


  getAllResellers() {
    return this.http.get<{ results: User[] }>(`${environment.apiUrl}/reseller`);
  }

  transformFilterObjectToQueryParams(paramObject) {
    return Object.keys(paramObject)
      .map((key) => key + "=" + paramObject[key])
      .join("&");
  }

  getManagersForReassignment() {
    return this.http.get(`${environment.apiUrl}/user/managersForReassignment`);
  }

  assignManager(newManager, user) {
    return this.http.post(`${environment.apiUrl}/user/assignManager`, {
      newManager,
      user,
    });
  }

  getUsersLeadActivity(email: string, filters) {
    const qs = this.transformFilterObjectToQueryParams(filters);
    return this.http.get(
      `${environment.apiUrl}/user/lead/activity/${email}?${qs}`
    );
  }

  getUserById(userid: string) {
    return this.http.get(`${environment.apiUrl}/user/single/${userid}`);
  }

  updateUser(userid: string, userObj: any) {
    return this.http.put(`${environment.apiUrl}/user/${userid}`, userObj);
  }

  getUsersLeadLogs(userEmail: string, dateRange?: string[]) {
    return this.http.post(`${environment.apiUrl}/lead/activity/logs`, {
      userEmail,
      dateRange,
    });
  }

  createReseller(resellerData: any) {
    return this.http.post(`${environment.apiUrl}/user/reseller`, resellerData);
  }


  getAllResellerOrganizations() {
    return this.http.get(`${environment.apiUrl}/organization/reseller`);
  }


  getAllManagers(userEmail?: string) {
    const params = new HttpParams();
    if(userEmail) {
      params.set('userEmail', userEmail);
    }
    return this.http.get(`${environment.apiUrl}/user/managers`, {params});
  }


  getUserProfile() {
    return this.http.get(`${environment.apiUrl}/user/profile`);
  }
}
