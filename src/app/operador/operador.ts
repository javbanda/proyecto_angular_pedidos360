import { Component, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-operador',
  standalone: true,
  template: `
    <main style="padding: 24px">
      <h1>Panel del Operador - Pedidos360</h1>
      <p>Sesión iniciada con Microsoft Entra ID.</p>
      <p>Cuenta: {{ correo }}</p>

      <button type="button" (click)="cerrarSesion()">Cerrar sesión Microsoft</button>
    </main>
  `,
})
export class Operador {
  private readonly msal = inject(MsalService);

  get correo(): string {
    return this.msal.instance.getActiveAccount()?.username ?? '';
  }

  cerrarSesion(): void {
    void this.msal.logoutRedirect();
  }
}
