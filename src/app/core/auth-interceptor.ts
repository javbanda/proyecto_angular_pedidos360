import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    const reqConToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return next(reqConToken);
  }

  return next(req);
};