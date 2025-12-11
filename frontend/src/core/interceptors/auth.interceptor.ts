import { Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  let modifiedReq = req;

  if (token) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearers ${token}`,
      },
    });
    return next(modifiedReq);
  }

  return next(req);
};
