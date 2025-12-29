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
  // Use HttpBackend to create a client that bypasses interceptors
  // This prevents the refresh request from triggering this interceptor again (infinite loop)
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

  // Handle the request and catch errors
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Interceptor caught error for URL:', req.url, 'status:', error.status);
      // check if error is 401 (unauthorized)
      if (error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          // Attempt to refresh token
          // We use the 'http' instance created from HttpBackend to avoid circular dependency loops
          return http
            .post<any>(`${environment.apiUrl}auth/refresh`, { refreshToken: refreshToken })
            .pipe(
              switchMap((res: any) => {
                // Success: Update tokens
                localStorage.setItem('authToken', res.accessToken);
                // If backend rotates refresh token, update it too:
                if (res.refreshToken) {
                  localStorage.setItem('refreshToken', res.refreshToken);
                }

                // Retry the ORIGINAL request with the new token
                const newRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`,
                  },
                });
                return next(newRequest);
              }),
              catchError((refreshError) => {
                // Refresh failed (token expired or invalid) -> Logout
                localStorage.clear();
                router.navigate(['/login']);
                return throwError(() => refreshError);
              })
            );
        }
      }

      // If not 401 or no refresh token, propagate error
      return throwError(() => error);
    })
  );
};
