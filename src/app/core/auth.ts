
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      environment.apiLogin,
      {
        email: email,
        password: password
      }
    ).pipe(
      tap(respuesta => {
        localStorage.setItem('accessToken', respuesta.accessToken);
        localStorage.setItem('idToken', respuesta.idToken);
        localStorage.setItem('refreshToken', respuesta.refreshToken);
      })
    );
  }

  obtenerAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  obtenerIdToken(): string | null {
    return localStorage.getItem('idToken');
  }

  private decodificarToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  estaAutenticado(): boolean {
    const token = this.obtenerAccessToken();

    if (!token) {
      return false;
    }

    const datos = this.decodificarToken(token);

    return !!datos && typeof datos.exp === 'number'
      && datos.exp * 1000 > Date.now();
  }

  obtenerRoles(): string[] {
    const token = this.obtenerAccessToken();

    if (!token || !this.estaAutenticado()) {
      return [];
    }

    const datos = this.decodificarToken(token);
    const grupos = datos?.['cognito:groups'];

    return Array.isArray(grupos) ? grupos : [];
  }

  esAdministrador(): boolean {
    return this.obtenerRoles().includes('ROLE_ADMIN');
  }

  cerrarSesion(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
  }
}
