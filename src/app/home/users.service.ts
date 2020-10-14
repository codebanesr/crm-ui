import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  getUsers(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters?: Array<{ key: string; value: string[] }>
  ): Observable<{ results: User[] }> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`);
    // filters.forEach(filter => {
    //   filter.value.forEach(value => {
    //     params = params.append(filter.key, value);
    //   });
    // });
    return this.http.get<{ results: User[] }>(`${environment.apiUrl}/user/allUsers`, { params });
  }

  getAllUsersHack() {
    return this.http.get<{ results: User[] }>(`${environment.apiUrl}/user`);
  }
  transformFilterObjectToQueryParams(paramObject) {
    return Object.keys(paramObject).map(key => key + '=' + paramObject[key]).join('&');
  }

  getManagersForReassignment() {
    return this.http.get(`${environment.apiUrl}/user/managersForReassignment`);
  }


  assignManager(newManager, user) {
    return this.http.post(`${environment.apiUrl}/user/assignManager`, {newManager, user});
  }


  getUsersLeadActivity(email: string, filters) {
    const qs = this.transformFilterObjectToQueryParams(filters);
    return this.http.get(`${environment.apiUrl}/user/lead/activity/${email}?${qs}`);
  }

  getUserById(userid: string) {
    return this.http.get(`${environment.apiUrl}/user/single/${userid}`);
  }

  updateUser(userid: string, userObj: any) {
    return this.http.put(`${environment.apiUrl}/user/${userid}`, userObj);
  }

  getUsersLeadLogs(userEmail: string, dateRange?: string[]) {
    return this.http.post(`${environment.apiUrl}/lead/activity/logs`, {userEmail, dateRange});
  }
}
