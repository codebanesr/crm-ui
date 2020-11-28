import { HttpErrorResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = "Authorization";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router
  ) {}

  getToken() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser.accessToken;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    // @Todo change this
    if (req.url.indexOf("login") !== -1) {
      return next.handle(authReq);
    }

    const token = this.getToken();
    if (token != null) {
      authReq = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, "Bearer " + token),
      });
    }
    return next.handle(authReq).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.router.navigate(["login"]);
          }
        }
      )
    );
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
