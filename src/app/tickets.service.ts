import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private http: HttpClient) {}

  getAllTickets(page: number, perPage: number) {
    return this.http.get(`${environment.apiUrl}/ticket?page=${page}&perPage=${perPage}`);
  }

  addTicket(ticket) {
    return this.http.post(`${environment.apiUrl}/ticket`, ticket);
  }

  getTicketById(ticketId: string) {
    return this.http.get(`${environment.apiUrl}/ticket/${ticketId}`);
  }

  getTicketByLeadId(leadId: string) {
    return this.http.get(`${environment.apiUrl}/ticket/lead/${leadId}`);
  }


  updateTicket(ticket, ticketId: string) {
    return this.http.put(`${environment.apiUrl}/ticket/${ticketId}`, ticket);
  }


  suggestLead(leadId) {
    return this.http.get(`${environment.apiUrl}/ticket/suggest/${leadId}`);
  }
}
