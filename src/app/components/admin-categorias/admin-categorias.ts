import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria, CategoriaService } from '../../services/categoria';
@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categorias.html',
  styleUrl: '../admin-module.css',
})
export class AdminCategorias implements OnInit {
  categorias = signal<Categoria[]>([]);
  mensaje = signal('');
  error = signal('');
  form: Categoria = { nombre: '' };
  editandoId: number | null = null;
  constructor(private service: CategoriaService) {}
  ngOnInit() {
    this.recargar();
  }
  guardar() {
    const req = this.editandoId
      ? this.service.actualizarCategoria(this.editandoId, this.form)
      : this.service.crearCategoria(this.form);
    req.subscribe({
      next: () => {
        this.mensaje.set(this.editandoId ? 'Categoría actualizada.' : 'Categoría creada.');
        this.cancelar();
        this.recargar();
      },
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudo guardar la categoría.'),
    });
  }
  editar(item: Categoria) {
    this.editandoId = item.id ?? null;
    this.form = { ...item };
  }
  eliminar(item: Categoria) {
    if (item.id && confirm(`¿Eliminar ${item.nombre}?`))
      this.service.eliminarCategoria(item.id).subscribe({
        next: () => {
          this.mensaje.set('Categoría eliminada.');
          this.recargar();
        },
        error: () => this.error.set('No se pudo eliminar la categoría.'),
      });
  }
  cancelar() {
    this.editandoId = null;
    this.form = { nombre: '' };
  }
  private recargar() {
    this.service
      .obtenerCategorias()
      .subscribe({
        next: (x) => this.categorias.set(x),
        error: () => this.error.set('No se pudieron cargar las categorías.'),
      });
  }
}
