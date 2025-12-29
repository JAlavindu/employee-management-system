import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const httpBackend = inject(HttpBackend);
  const http = new HttpClient(httpBackend);

  const token = localStorage.getItem('authToken');

  console.log('Interceptor: URL =', req.url, 'Token found? =', !!token);
  console.log('Interceptor: existing Authorization header =', req.headers.get('Authorization'));

  let modifiedReq = req;
  if (token) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Interceptor caught error for URL:', req.url, 'status:', error.status);
      if (error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          return http
            .post<any>(`${environment.apiUrl}auth/refresh`, { refreshToken: refreshToken })
            .pipe(
              switchMap((res: any) => {
                localStorage.setItem('authToken', res.accessToken);
                if (res.refreshToken) {
                  localStorage.setItem('refreshToken', res.refreshToken);
                }

                const newRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`,
                  },
                });
                return next(newRequest);
              }),
              catchError((refreshError) => {
                localStorage.clear();
                router.navigate(['/login']);
                return throwError(() => refreshError);
              })
            );
        }
      }

      return throwError(() => error);
    })
  );
};
