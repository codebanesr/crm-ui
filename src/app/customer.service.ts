import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  uploadCustomers(file: File) {
    const fd = new FormData();
    fd.append('customers', file);
    return this.http.post("http://35.154.8.217:5182/customer/many", fd);
  }
}

