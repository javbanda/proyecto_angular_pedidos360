
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../core/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  nombrePlataforma = 'Pedidos360';

  constructor(
    public auth: Auth,
    private router: Router
  ) {}

  estaAutenticado(): boolean {
    return this.auth.estaAutenticado();
  }

  esAdministrador(): boolean {
    return this.auth.esAdministrador();
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/login']);
  }
}