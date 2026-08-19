import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoService, Marca } from '../../services/catalogo';

@Component({ selector: 'app-admin-marcas', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-marcas.html', styleUrl: '../admin-module.css' })
export class AdminMarcas implements OnInit {
  marcas = signal<Marca[]>([]); mensaje = signal(''); error = signal(''); marca: Marca = this.nuevaMarca();
  constructor(private catalogo: CatalogoService) {}
  ngOnInit(): void { this.recargar(); }
  guardarMarca(): void { this.catalogo.crearMarca(this.marca).subscribe({ next: () => { this.marca = this.nuevaMarca(); this.ok('Marca registrada.'); }, error: e => this.error.set(e?.error?.message ?? 'No se pudo registrar la marca.') }); }
  eliminarMarca(item: Marca): void { if (!item.id || !confirm(`¿Eliminar ${item.nombre}?`)) return; this.catalogo.eliminarMarca(item.id).subscribe({ next: () => this.ok('Marca eliminada.'), error: e => this.error.set(e?.error?.message ?? 'No se pudo eliminar la marca.') }); }
  private ok(texto: string): void { this.mensaje.set(texto); this.error.set(''); this.recargar(); }
  private recargar(): void { this.catalogo.marcas().subscribe({ next: x => this.marcas.set(x), error: () => this.error.set('No se pudieron cargar las marcas.') }); }
  private nuevaMarca(): Marca { return { nombre: '', descripcion: '', logo: '', activo: true }; }
}
