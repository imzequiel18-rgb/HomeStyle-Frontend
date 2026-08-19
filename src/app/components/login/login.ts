import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  password = '';
  mostrarPassword = signal(false);
  cargando = signal(false);
  error = signal('');

  constructor(
    private usuarioService: UsuarioService,
    private carritoService: CarritoService,
    private router: Router,
  ) {}

  iniciarSesion() {
    this.error.set('');

    if (!this.email.trim() || !this.password.trim()) {
      this.error.set('Ingresa tu correo y contrasena.');
      return;
    }

    this.cargando.set(true);

    this.usuarioService
      .login({
        email: this.email.trim(),
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          const rol = (response?.rol ?? '').toString().trim().toUpperCase();

          localStorage.setItem('usuarioId', response?.id?.toString() ?? '');
          localStorage.setItem('usuarioEmail', response?.email ?? this.email.trim());
          localStorage.setItem(
            'usuarioNombre',
            response?.userName ?? response?.nombre ?? response?.user ?? '',
          );
          localStorage.setItem('rol', rol);
          localStorage.setItem('token', response?.token ?? '');
          if (rol === 'ADMIN') {
            this.router.navigate(['/admin']);
            return;
          }

          if (rol === 'CLIENTE') {
            this.carritoService.establecerUsuario(
              response?.id?.toString() ?? response?.email ?? this.email.trim(),
            );
            this.router.navigate(['/tienda']);
            return;
          }

          this.error.set('Tu usuario no tiene un rol valido.');
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error al iniciar sesion:', err);
          const mensaje = err?.error?.message ?? err?.error ?? '';
          this.error.set(mensaje || 'Correo o contrasena incorrectos.');
          this.cargando.set(false);
        },
      });
  }
}
