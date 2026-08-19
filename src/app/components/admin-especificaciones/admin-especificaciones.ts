import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria, CategoriaService } from '../../services/categoria';
import { Atributo, CatalogoService, CategoriaAtributo } from '../../services/catalogo';

@Component({ selector: 'app-admin-especificaciones', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-especificaciones.html', styleUrl: '../admin-module.css' })
export class AdminEspecificaciones implements OnInit {
  atributos = signal<Atributo[]>([]); relaciones = signal<CategoriaAtributo[]>([]); categorias = signal<Categoria[]>([]);
  mensaje = signal(''); error = signal(''); atributo: Atributo = this.nuevoAtributo(); relacion: CategoriaAtributo = this.nuevaRelacion();
  constructor(private catalogo: CatalogoService, private categoriaService: CategoriaService) {}
  ngOnInit(): void { this.recargar(); this.categoriaService.obtenerCategorias().subscribe({ next: x => this.categorias.set(x) }); }
  guardarAtributo(): void { this.catalogo.crearAtributo(this.atributo).subscribe({ next: () => { this.atributo = this.nuevoAtributo(); this.ok('Especificación registrada.'); }, error: e => this.falla(e, 'No se pudo registrar la especificación.') }); }
  asignar(): void { if (!this.relacion.categoriaId || !this.relacion.atributoId) { this.error.set('Selecciona una categoría y una especificación.'); return; } this.catalogo.crearRelacion(this.relacion).subscribe({ next: () => { this.relacion = this.nuevaRelacion(); this.ok('Especificación asignada a la categoría.'); }, error: e => this.falla(e, 'No se pudo asignar la especificación.') }); }
  eliminarAtributo(item: Atributo): void { if (item.id && confirm(`¿Eliminar ${item.nombre}?`)) this.catalogo.eliminarAtributo(item.id).subscribe({ next: () => this.ok('Especificación eliminada.'), error: e => this.falla(e, 'No se pudo eliminar la especificación.') }); }
  eliminarRelacion(item: CategoriaAtributo): void { if (item.id) this.catalogo.eliminarRelacion(item.id).subscribe({ next: () => this.ok('Asignación eliminada.'), error: e => this.falla(e, 'No se pudo eliminar la asignación.') }); }
  private ok(texto: string): void { this.mensaje.set(texto); this.error.set(''); this.recargar(); }
  private falla(e: any, respaldo: string): void { this.error.set(e?.error?.message ?? respaldo); }
  private recargar(): void { this.catalogo.atributos().subscribe({ next: x => this.atributos.set(x) }); this.catalogo.relaciones().subscribe({ next: x => this.relaciones.set(x) }); }
  private nuevoAtributo(): Atributo { return { nombre: '', tipoDato: 'TEXTO', unidad: '', activo: true }; }
  private nuevaRelacion(): CategoriaAtributo { return { categoriaId: 0, atributoId: 0, obligatorio: false, orden: 1 }; }
}
