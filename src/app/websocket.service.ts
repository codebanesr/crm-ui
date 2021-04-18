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
    this.createWSConnection();
  }
  
  createWSConnection() {
    this.socket = connect(environment.alertsUrl, {secure: environment.production ? true: false});
    const currentUser:CurrentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.socket.on('connect', () => {
      console.log("connected")
      this.socket.emit('joinRoom', currentUser.email);
    });
  }

  getAlerts(): Observable<string> {
    if(!this.socket.connected) {
      this.createWSConnection();
    }

    return fromEvent<string>(this.socket, 'chatToClient').pipe(text=>text);
  }


  disconnect() {
    this.socket.disconnect();
  }
}
