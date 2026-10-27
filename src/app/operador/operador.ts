import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';

import {
  OperadorApiService,
  Ticket,
  Notificacion,
  EstadoTicket,
  EstadoNotificacion,
} from './operador-api.service';

@Component({
  selector: 'app-operador',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="panel">
      <header class="cabecera">
        <div>
          <h1>Panel del Operador</h1>
          <p>Pedidos360 · Microsoft Entra ID</p>
          <small>Cuenta: {{ correo }}</small>
        </div>
        <button type="button" (click)="cerrarSesion()">Cerrar sesión</button>
      </header>

      <section class="filtros">
        <label for="sucursal">Sucursal:</label>
        <input id="sucursal" type="number" min="1" [(ngModel)]="sucursalId" />
        <button type="button" (click)="cargarTodo()">Consultar sucursal</button>
      </section>

      <section class="tarjeta">
        <div class="titulo-seccion">
          <h2>Tickets de preparación</h2>

          <select
            aria-label="Filtrar tickets por estado"
            [(ngModel)]="estadoTickets"
            (ngModelChange)="cargarTickets()"
          >
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_PREPARACION">En preparación</option>
            <option value="LISTO">Listos</option>
            <option value="CANCELADO">Cancelados</option>
          </select>
        </div>

        @if (errorTickets()) {
          <p class="error">{{ errorTickets() }}</p>
        }

        @if (cargandoTickets()) {
          <p>Cargando tickets...</p>
        } @else if (tickets().length === 0) {
          <p>No hay tickets para el filtro seleccionado.</p>
        } @else {
          <div class="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Pedido</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (ticket of tickets(); track ticket.id) {
                  <tr>
                    <td>#{{ ticket.id }}</td>
                    <td>#{{ ticket.pedidoId }}</td>
                    <td>{{ ticket.estado }}</td>
                    <td>
                      @if (ticket.estado === 'PENDIENTE') {
                        <button
                          type="button"
                          [disabled]="guardandoTicketId() === ticket.id"
                          (click)="cambiarEstado(ticket, 'EN_PREPARACION')"
                        >
                          Preparar
                        </button>
                      }

                      @if (ticket.estado === 'EN_PREPARACION') {
                        <button
                          type="button"
                          [disabled]="guardandoTicketId() === ticket.id"
                          (click)="cambiarEstado(ticket, 'LISTO')"
                        >
                          Marcar listo
                        </button>
                      }

                      @if (ticket.estado === 'PENDIENTE' || ticket.estado === 'EN_PREPARACION') {
                        <button
                          type="button"
                          class="secundario"
                          [disabled]="guardandoTicketId() === ticket.id"
                          (click)="cambiarEstado(ticket, 'CANCELADO')"
                        >
                          Cancelar
                        </button>
                      }

                      @if (ticket.estado === 'LISTO' || ticket.estado === 'CANCELADO') {
                        <span>Finalizado</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <section class="tarjeta">
        <div class="titulo-seccion">
          <h2>Notificaciones</h2>

          <select
            aria-label="Filtrar notificaciones"
            [(ngModel)]="estadoNotificaciones"
            (ngModelChange)="cargarNotificaciones()"
          >
            <option value="NO_LEIDA">Sin leer</option>
            <option value="LEIDA">Leídas</option>
          </select>
        </div>

        @if (errorNotificaciones()) {
          <p class="error">{{ errorNotificaciones() }}</p>
        }

        @if (cargandoNotificaciones()) {
          <p>Cargando notificaciones...</p>
        } @else if (notificaciones().length === 0) {
          <p>No hay notificaciones para el filtro seleccionado.</p>
        } @else {
          @for (notificacion of notificaciones(); track notificacion.id) {
            <article class="notificacion">
              <div>
                <strong>Pedido #{{ notificacion.pedidoId }}</strong>
                <p>{{ notificacion.mensaje }}</p>
                <small>Estado: {{ notificacion.estado }}</small>
              </div>

              @if (notificacion.estado === 'NO_LEIDA') {
                <button
                  type="button"
                  [disabled]="guardandoNotificacionId() === notificacion.id"
                  (click)="marcarLeida(notificacion)"
                >
                  Marcar como leída
                </button>
              }
            </article>
          }
        }
      </section>
    </main>
  `,
  styles: [
    `
      .panel {
        max-width: 1100px;
        margin: 0 auto;
        padding: 28px;
        font-family: Arial, sans-serif;
      }

      .cabecera,
      .titulo-seccion,
      .filtros,
      .notificacion {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }

      .cabecera {
        margin-bottom: 24px;
      }

      .cabecera p,
      small {
        color: #64748b;
      }

      .tarjeta {
        padding: 24px;
        margin-top: 20px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #fff;
        color: #172033;
      }

      .filtros {
        justify-content: flex-start;
      }

      .filtros input {
        width: 85px;
      }

      input,
      select {
        padding: 9px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
      }

      button {
        padding: 10px 14px;
        border: 0;
        border-radius: 6px;
        background: #2563eb;
        color: white;
        cursor: pointer;
        margin: 3px;
      }

      button.secundario {
        background: #64748b;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .tabla-contenedor {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }

      .notificacion {
        padding: 15px 0;
        border-bottom: 1px solid #e2e8f0;
      }

      .notificacion p {
        margin: 6px 0;
      }

      .error {
        color: #b91c1c;
        font-weight: 600;
      }
    `,
  ],
})
export class Operador implements OnInit {
  private readonly api = inject(OperadorApiService);
  private readonly msal = inject(MsalService);

  readonly tickets = signal<Ticket[]>([]);
  readonly notificaciones = signal<Notificacion[]>([]);

  readonly cargandoTickets = signal(false);
  readonly cargandoNotificaciones = signal(false);

  readonly guardandoTicketId = signal<number | null>(null);
  readonly guardandoNotificacionId = signal<number | null>(null);

  readonly errorTickets = signal('');
  readonly errorNotificaciones = signal('');

  sucursalId = 1;
  estadoTickets: EstadoTicket = 'PENDIENTE';
  estadoNotificaciones: EstadoNotificacion = 'NO_LEIDA';

  ngOnInit(): void {
    this.cargarTodo();
  }

  get correo(): string {
    return this.msal.instance.getActiveAccount()?.username ?? '';
  }

  cargarTodo(): void {
    this.cargarTickets();
    this.cargarNotificaciones();
  }

  cargarTickets(): void {
    if (!Number.isInteger(this.sucursalId) || this.sucursalId <= 0) {
      this.tickets.set([]);
      this.errorTickets.set('Ingresa una sucursal válida.');
      return;
    }

    this.cargandoTickets.set(true);
    this.errorTickets.set('');

    this.api.obtenerTickets(this.sucursalId, this.estadoTickets).subscribe({
      next: (datos) => {
        this.tickets.set(datos);
        this.cargandoTickets.set(false);
      },
      error: (error) => {
        this.errorTickets.set(this.mensajeError(error));
        this.cargandoTickets.set(false);
      },
    });
  }

  cargarNotificaciones(): void {
    if (!Number.isInteger(this.sucursalId) || this.sucursalId <= 0) {
      this.notificaciones.set([]);
      this.errorNotificaciones.set('Ingresa una sucursal válida.');
      return;
    }

    this.cargandoNotificaciones.set(true);
    this.errorNotificaciones.set('');

    this.api.obtenerNotificaciones(this.sucursalId, this.estadoNotificaciones).subscribe({
      next: (datos) => {
        this.notificaciones.set(datos);
        this.cargandoNotificaciones.set(false);
      },
      error: (error) => {
        this.errorNotificaciones.set(this.mensajeError(error));
        this.cargandoNotificaciones.set(false);
      },
    });
  }

  cambiarEstado(ticket: Ticket, estado: EstadoTicket): void {
    this.guardandoTicketId.set(ticket.id);
    this.errorTickets.set('');

    this.api.actualizarTicket(ticket.id, estado).subscribe({
      next: () => {
        this.guardandoTicketId.set(null);
        this.cargarTickets();
      },
      error: (error) => {
        this.guardandoTicketId.set(null);
        this.errorTickets.set(this.mensajeError(error));
      },
    });
  }

  marcarLeida(notificacion: Notificacion): void {
    this.guardandoNotificacionId.set(notificacion.id);
    this.errorNotificaciones.set('');

    this.api.marcarNotificacionLeida(notificacion.id).subscribe({
      next: () => {
        this.guardandoNotificacionId.set(null);
        this.cargarNotificaciones();
      },
      error: (error) => {
        this.guardandoNotificacionId.set(null);
        this.errorNotificaciones.set(this.mensajeError(error));
      },
    });
  }

  cerrarSesion(): void {
    void this.msal.logoutRedirect();
  }

  private mensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'No se pudo conectar con Mensajería. Revisa el servidor y CORS.';
      }
      if (error.status === 401) {
        return 'Sesión o token inválido. Vuelve a iniciar sesión.';
      }
      if (error.status === 403) {
        return 'Tu cuenta no tiene permiso para realizar esta operación.';
      }
      return `Error HTTP ${error.status} al consultar Mensajería.`;
    }

    return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
  }
}
