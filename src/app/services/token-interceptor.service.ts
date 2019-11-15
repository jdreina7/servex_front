import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() {
    console.log('INGRESO AL INTERCEPTOR');
  }

  intercept(req, next) {
    const tokenizedReq = req.clone({
       setHeaders: {
         Authorization: 'Bearer xx.yy.zz'
       }
    });

    return next.handle(tokenizedReq);
  }
}
