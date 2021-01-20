import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { IRules } from './rules/add-rules/rules.constants';

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor(private http: HttpClient) {}

  addRule(rulesObj: IRules) {
    return this.http.post<IRules>(`${environment.apiUrl}/rules`, rulesObj);
  }

  getAllRules(campaignId: string, limit: number = 20, offset: number = 0): Observable<IRules[]> {
    return this.http.get<IRules[]>(`${environment.apiUrl}/rules/all/${campaignId}?limit=${limit}&offset=${offset}`);
  }

  getRuleById(ruleId: string): Observable<IRules> {
    return this.http.get<IRules>(`${environment.apiUrl}/rules/${ruleId}`);
  }
}
