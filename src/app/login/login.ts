import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../core/auth';

type ModoLogin = 'login' | 'registro' | 'recuperar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  // Controla qué formulario se muestra
  modo = signal<ModoLogin>('login');

  // Campos del formulario de login
  email = '';
  password = '';

  // Mensaje para mostrar resultado del login
  mensaje = '';

  // Campos del formulario de registro
  nombreRegistro = '';
  emailRegistro = '';
  passwordRegistro = '';

  // Campo de recuperar contraseña
  emailRecuperar = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  cambiarModo(nuevoModo: ModoLogin): void {
    this.modo.set(nuevoModo);
    this.mensaje = '';
  }

  iniciarSesion(): void {

    if (!this.email || !this.password) {
      this.mensaje = 'Debe ingresar correo y contraseña.';
      return;
    }

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.mensaje = 'Inicio de sesión exitoso.';
        this.router.navigate(['/reportes']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.mensaje = 'Correo o contraseña incorrectos.';
      }
    });
  }

  registrarUsuario(): void {
    console.log(
      'Registro pendiente de integrar con backend:',
      this.nombreRegistro,
      this.emailRegistro
    );
  }

  enviarRecuperacion(): void {
    console.log(
      'Recuperar contraseña pendiente de integrar con backend:',
      this.emailRecuperar
    );
  }
}