import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario';
interface UsuarioAdmin {
  id?: number;
  email: string;
  userName: string;
  phoneNumber: string;
  password?: string;
  rol?: 'ADMIN' | 'CLIENTE';
}
@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: '../admin-module.css',
})
export class AdminUsuarios implements OnInit {
  usuarios = signal<UsuarioAdmin[]>([]);
  mensaje = signal('');
  error = signal('');
  form = this.nuevo();
  editandoId: number | null = null;
  constructor(private service: UsuarioService) {}
  ngOnInit() {
    this.recargar();
  }
  guardar() {
    if (!this.form.password) {
      this.error.set('La contraseña es obligatoria.');
      return;
    }
    const payload = {
      email: this.form.email,
      userName: this.form.userName,
      phoneNumber: this.form.phoneNumber,
      password: this.form.password,
      rol: this.form.rol,
    };
    const req = this.editandoId
      ? this.service.actualizarUsuario(this.editandoId, payload)
      : this.service.crearUsuario(payload);
    req.subscribe({
      next: () => {
        this.mensaje.set(this.editandoId ? 'Usuario actualizado.' : 'Usuario creado.');
        this.cancelar();
        this.recargar();
      },
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudo guardar el usuario.'),
    });
  }
  editar(x: UsuarioAdmin) {
    this.editandoId = x.id ?? null;
    this.form = { ...x, password: '' };
  }
  eliminar(x: UsuarioAdmin) {
    if (x.id && confirm(`¿Eliminar ${x.userName}?`))
      this.service.eliminarUsuario(x.id).subscribe({
        next: () => {
          this.mensaje.set('Usuario eliminado.');
          this.recargar();
        },
        error: () => this.error.set('No se pudo eliminar el usuario.'),
      });
  }
  cancelar() {
    this.editandoId = null;
    this.form = this.nuevo();
  }
  private recargar() {
    this.service.obtenerUsuarios().subscribe({
      next: (x: any) => {
        const lista = Array.isArray(x) ? x : (x?.content ?? []);
        this.usuarios.set(
          lista.map((u: any) => ({
            id: u.id ?? u.Id,
            email: u.email ?? '',
            userName: u.userName ?? u.user ?? '',
            phoneNumber: u.phoneNumber ?? '',
            rol: u.rol ?? 'CLIENTE',
          })),
        );
      },
      error: () => this.error.set('No se pudieron cargar los usuarios.'),
    });
  }
  private nuevo(): UsuarioAdmin {
    return { email: '', userName: '', phoneNumber: '', password: '', rol: 'CLIENTE' };
  }
}
