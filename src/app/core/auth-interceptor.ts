import { HttpInterceptorFn } from '@angular/common/http';

// APIs utilizadas por las funcionalidades anteriores.
// El token antiguo no debe enviarse a otras direcciones.
const legacyApiUrls = [
  'http://localhost:8082/api/usuarios',
  'http://localhost:8083/api/catalog',
  'https://ha9pj655yl.execute-api.us-east-1.amazonaws.com/api/orders',
  'https://xw6uf5fra5.execute-api.us-east-1.amazonaws.com/api/report',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const requestUrl = new URL(req.url, window.location.origin);

  const esApiAnterior = legacyApiUrls.some((baseUrl) => {
    const permitida = new URL(baseUrl);

    return (
      requestUrl.origin === permitida.origin &&
      (requestUrl.pathname === permitida.pathname ||
        requestUrl.pathname.startsWith(`${permitida.pathname}/`))
    );
  });

  // No adjuntar tokens antiguos a otras APIs.
  if (!esApiAnterior) {
    return next(req);
  }

  // El login no necesita recibir un token anterior.
  if (requestUrl.pathname === '/api/usuarios/login') {
    return next(req);
  }

  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );
};
