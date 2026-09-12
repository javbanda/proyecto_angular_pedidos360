import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type ModoLogin = 'login' | 'registro' | 'recuperar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // controla qué formulario se muestra (no es un objeto de datos, es "estado de vista")
  modo = signal<ModoLogin>('login');

  // campos del formulario de login (propiedades normales, no signals)
  email = '';
  password = '';

  // campos del formulario de registro
  nombreRegistro = '';
  emailRegistro = '';
  passwordRegistro = '';

  // campo de recuperar contraseña
  emailRecuperar = '';

  cambiarModo(nuevoModo: ModoLogin): void {
    this.modo.set(nuevoModo);
  }

  iniciarSesion(): void {
    console.log('Login (pendiente de integrar con backend):', this.email, this.password);
  }

  registrarUsuario(): void {
    console.log('Registro (pendiente de integrar con backend):', this.nombreRegistro, this.emailRegistro);
  }

  enviarRecuperacion(): void {
    console.log('Recuperar contraseña (pendiente de integrar con backend):', this.emailRecuperar);
  }
}