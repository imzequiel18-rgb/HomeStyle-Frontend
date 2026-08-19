import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroComponent {
  nombre = '';
  email = '';
  telefono = '';
  password = '';
  confirmarPassword = '';
  mostrarPassword = signal(false);
  mostrarConfirmarPassword = signal(false);
  cargando = signal(false);
  error = signal('');

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  registrar(): void {
    this.error.set('');

    if (!this.nombre.trim() || !this.email.trim() || !this.telefono.trim() || !this.password) {
      this.error.set('Completa todos los campos.');
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error.set('Las contrasenas no coinciden.');
      return;
    }

    this.cargando.set(true);
    this.usuarioService
      .crearUsuario({
        userName: this.nombre.trim(),
        email: this.email.trim(),
        phoneNumber: this.telefono.trim(),
        password: this.password,
        rol: 'CLIENTE',
      })
      .subscribe({
        next: () => this.router.navigate(['/login'], { queryParams: { registrado: 'true' } }),
        error: (err) => {
          const mensaje = err?.error?.message ?? err?.error ?? '';
          this.error.set(mensaje || 'No fue posible crear la cuenta. Intenta de nuevo.');
          this.cargando.set(false);
        },
      });
  }
}
