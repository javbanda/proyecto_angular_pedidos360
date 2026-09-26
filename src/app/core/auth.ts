import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

  private apiUrl = 'http://localhost:8082/api/usuarios';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
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

  estaAutenticado(): boolean {
    return !!this.obtenerAccessToken();
  }

  cerrarSesion(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
  }
}