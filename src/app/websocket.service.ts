import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { Socket, connect } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { CurrentUser } from './home/interfaces/global.interfaces';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket: typeof Socket;
  constructor() {
    this.socket = connect(environment.alertsUrl); 
    const currentUser:CurrentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("connecting to: ", environment.alertsUrl, currentUser.email);

    this.socket.on('connect', () => {
      this.socket.emit('joinRoom', currentUser.email);
      console.log('check 2', this.socket.connected);
    });
  }
  

  getAlerts(): Observable<string> {
    return fromEvent<string>(this.socket, 'chatToClient').pipe(text=>text);
  }


  disconnect() {
    this.socket.disconnect();
  }
}
