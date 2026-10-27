import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { Observable, switchMap, throwError } from 'rxjs';

import { loginRequest } from './auth/auth-config';

export type EstadoTicket = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'CANCELADO';

export type EstadoNotificacion = 'NO_LEIDA' | 'LEIDA';

export interface Ticket {
  id: number;
  pedidoId: number;
  sucursalId: number;
  estado: EstadoTicket;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Notificacion {
  id: number;
  ticketId: number;
  pedidoId: number;
  sucursalId: number;
  tipo: string;
  mensaje: string;
  estado: EstadoNotificacion;
  fechaCreacion: string;
  fechaLectura: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class OperadorApiService {
  private readonly http = inject(HttpClient);
  private readonly msal = inject(MsalService);

  private readonly apiUrl = 'http://localhost:8083/api';

  private conToken<T>(peticion: (token: string) => Observable<T>): Observable<T> {
    const cuenta = this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];

    if (!cuenta) {
      return throwError(() => new Error('Debes iniciar sesión con Microsoft.'));
    }

    return this.msal
      .acquireTokenSilent({
        ...loginRequest,
        account: cuenta,
      })
      .pipe(switchMap((resultado) => peticion(resultado.accessToken)));
  }

  obtenerTickets(sucursalId: number, estado: EstadoTicket): Observable<Ticket[]> {
    return this.conToken((token) =>
      this.http.get<Ticket[]>(`${this.apiUrl}/tickets`, {
        params: new HttpParams().set('sucursalId', sucursalId).set('estado', estado),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  }

  actualizarTicket(ticketId: number, estado: EstadoTicket): Observable<Ticket> {
    return this.conToken((token) =>
      this.http.patch<Ticket>(
        `${this.apiUrl}/tickets/${ticketId}/estado`,
        { estado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
  }

  obtenerNotificaciones(
    sucursalId: number,
    estado: EstadoNotificacion,
  ): Observable<Notificacion[]> {
    return this.conToken((token) =>
      this.http.get<Notificacion[]>(`${this.apiUrl}/notificaciones`, {
        params: new HttpParams().set('sucursalId', sucursalId).set('estado', estado),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  }

  marcarNotificacionLeida(notificacionId: number): Observable<Notificacion> {
    return this.conToken((token) =>
      this.http.patch<Notificacion>(`${this.apiUrl}/notificaciones/${notificacionId}/leida`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  }
}
