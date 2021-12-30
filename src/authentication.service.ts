import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentUser } from './app/home/interfaces/global.interfaces';
import { User } from './app/home/interfaces/user';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService  {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<CurrentUser>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): CurrentUser {
    return this.currentUserSubject.value;
  }


  storeUserInfo(user) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return user;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/user/login`, { email, password })
      .pipe(map(user => {
        return this.storeUserInfo(user);
      }));
  }


  loginWithSocialAuthToken({email, idToken, provider}) {
    return this.http.post<any>(`${environment.apiUrl}/user/oauth/login`, { email, idToken, provider })
      .pipe(map(user => {
        return this.storeUserInfo(user);
      }));
  }

  forgotPassword(email: string) {
    return this.http.post<any>(`${environment.apiUrl}/user/forgot-password`, { email })
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  signup(signupObj) {
    return this.http.post<any>(`${environment.apiUrl}/user`, signupObj)
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    this.router.navigate(['login']);  
  }
}
