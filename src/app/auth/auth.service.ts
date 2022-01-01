import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserA } from './userA.model';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<UserA>(null);
  showAutoLogoutModal = new Subject<boolean>();
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBLJ1QKpab0dMUof7uTaiVq9giPXdPEOV8',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorRes) => {
          let errorMessage = 'An unknown error occured!';
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
          }

          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already.';
          }
          return throwError(errorMessage);
        }),
        tap((resData) => {
          const expirationDate = new Date(
            new Date().getTime() + +resData.expiresIn * 1000
          );

          const user = new UserA(
            resData.email,
            resData.localId,
            resData.idToken,
            expirationDate
          );

          this.user.next(user);
          this.autoLogout(+resData.expiresIn * 1000);
          localStorage.setItem('userData', JSON.stringify(user));
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBLJ1QKpab0dMUof7uTaiVq9giPXdPEOV8',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorRes) => {
          let errorMessage = 'An unknown error occured!';
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
          }

          switch (errorRes.error.error.message) {
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'This email does not exist.';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'This password is not correct.';
              break;
          }
          return throwError(errorMessage);
        }),
        tap((resData) => {
          const expirationDate = new Date(
            new Date().getTime() + +resData.expiresIn * 1000
          );

          const user = new UserA(
            resData.email,
            resData.localId,
            resData.idToken,
            expirationDate
          );

          this.user.next(user);
          this.autoLogout(+resData.expiresIn * 1000);
          localStorage.setItem('userData', JSON.stringify(user));
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.showAutoLogoutModal.next(true)
    }, expirationDuration);
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser = new UserA(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }

    this.router.navigate(['/users']); // Add this if you want to instantly navigate to User list after page reload
  }
}
