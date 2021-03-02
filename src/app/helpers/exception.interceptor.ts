import { HttpErrorResponse, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from "rxjs";

@Injectable()
export class ExceptionInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                // do something if you want to otherwise just return the event
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                // handle all custom exceptions here, this should be a tailored message
                switch(error.error.statusCode) {
                    case 409: {
                        alert(error.error.message);
                        break;
                    }
                }
                return throwError(error);
            }));
    }
}


export const ExceptionInterceptorProvider = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: ExceptionInterceptor,
        multi: true
    }
]