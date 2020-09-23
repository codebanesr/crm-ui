import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlarmsService {

  constructor(
    private http: HttpClient
  ) {}




  get(body) {
    return this.http.post(`${environment.apiUrl}/lead/alarms/getAll`, {});
  }
}
