import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() { }

  getToken() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser.accessToken;
  }


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    // @Todo change this
    if(req.url.indexOf("login")!==-1) {
      return next.handle(authReq);
    }



    const token = this.getToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
