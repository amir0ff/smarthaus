import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (req.headers.get('NoAuth')) {
      return next.handle(req.clone());
    } else {
      const clonedreq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.authService.getToken())
      });
      return next.handle(clonedreq).pipe(
        tap(
          event => {
            if (event['status'] === 200) {
              // console.log('Valid token found!', event);
              next.handle(clonedreq);
            }
          },
          err => {
            if (err.error.auth === false) {
              // console.log('No valid token provided!', err);
              return;
            }
          })
      );
    }
  }
}
