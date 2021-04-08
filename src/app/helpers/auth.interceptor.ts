import { HttpErrorResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthenticationService } from "src/authentication.service";

const TOKEN_HEADER_KEY = "Authorization";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar
  ) {}

  getToken() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser?.accessToken;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;

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

            this._snackBar.open('Wrong username or password', 'Cancel', {
              duration: 2000,
              verticalPosition: 'top'
            });
            return this.authService.logout();
          }
        }
      )
    );
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
