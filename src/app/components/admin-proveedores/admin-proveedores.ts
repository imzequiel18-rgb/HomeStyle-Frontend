import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Proveedor, ProveedorService } from '../../services/proveedor';
@Component({
  selector: 'app-admin-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-proveedores.html',
  styleUrl: '../admin-module.css',
})
export class AdminProveedores implements OnInit {
  proveedores = signal<Proveedor[]>([]);
  mensaje = signal('');
  error = signal('');
  form: Proveedor = { nombre: '', correo: '', telefono: '' };
  editandoId: number | null = null;
  constructor(private service: ProveedorService) {}
  ngOnInit() {
    this.recargar();
  }
  guardar() {
    const req = this.editandoId
      ? this.service.actualizarProveedor(this.editandoId, this.form)
      : this.service.crearProveedor(this.form);
    req.subscribe({
      next: () => {
        this.mensaje.set(this.editandoId ? 'Proveedor actualizado.' : 'Proveedor creado.');
        this.cancelar();
        this.recargar();
      },
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudo guardar el proveedor.'),
    });
  }
  editar(x: Proveedor) {
    this.editandoId = x.id ?? null;
    this.form = { ...x };
  }
  eliminar(x: Proveedor) {
    if (x.id && confirm(`¿Eliminar ${x.nombre}?`))
      this.service.eliminarProveedor(x.id).subscribe({
        next: () => {
          this.mensaje.set('Proveedor eliminado.');
          this.recargar();
        },
        error: () => this.error.set('No se pudo eliminar el proveedor.'),
      });
  }
  cancelar() {
    this.editandoId = null;
    this.form = { nombre: '', correo: '', telefono: '' };
  }
  private recargar() {
    this.service
      .obtenerProveedores()
      .subscribe({
        next: (x) => this.proveedores.set(x),
        error: () => this.error.set('No se pudieron cargar los proveedores.'),
      });
  }
}
