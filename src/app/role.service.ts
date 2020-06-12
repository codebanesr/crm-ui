import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) {

  }


  createOrUpdateRole(body: any) {
    const object = {role: body}
    return this.http.post(`${environment.apiUrl}/roles/createOrUpdate`, object);
  }

  getAllRoles() {
    return this.http.get(`${environment.apiUrl}/roles`);
  }


  addPermission(permission) {
    const object = {permission: permission}
    return this.http.post(`${environment.apiUrl}/roles/permission`, object);
  }


  getAllPermissions() {
    return this.http.get(`${environment.apiUrl}/roles/permissions`);
  }
}
