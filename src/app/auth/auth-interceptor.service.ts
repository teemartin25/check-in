import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserA } from './userA.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  user: UserA;

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.authService.user.subscribe((authenticatedUser) => {
      this.user = authenticatedUser;
    });

    //console.log(this.user);
    if (!this.user) return next.handle(req);

    const modifiedReq = req.clone({
      params: new HttpParams().set('auth', this.user.token),
    });
    return next.handle(modifiedReq);
  }
}
