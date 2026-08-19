import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Carrito } from '../carrito/carrito';

import { Categoria, CategoriaService } from '../../services/categoria';
import { CarritoService } from '../../services/carrito';
import { ProductoService, ProductoTienda } from '../../services/producto';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    Carrito
  ],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class TiendaComponent implements OnInit {

  productos = signal<ProductoTienda[]>([]);
  categorias = signal<Categoria[]>([]);

  cargando = signal(true);
  error = signal('');

  categoriaSeleccionada = signal<number | null>(null);

  nombreCliente = signal('Cliente');

  busqueda = '';

  @ViewChild(Carrito)
  carritoComponent!: Carrito;

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService,
  ) {}

  irAMisPedidos(): void {
    this.router.navigate(['/mis-pedidos']);
  }

  irAlCatalogo(): void {
    document.getElementById('catalogo')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  ngOnInit(): void {

    const usuarioId =
      localStorage.getItem('usuarioId') ||
      localStorage.getItem('usuarioEmail');

    this.carritoService.establecerUsuario(usuarioId);

    this.nombreCliente.set(
      localStorage.getItem('usuarioNombre') ||
      localStorage.getItem('usuarioEmail') ||
      'Cliente'
    );

    this.cargarCatalogo();

    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
      },
    });
  }

  get productosFiltrados(): ProductoTienda[] {

    const termino = this.busqueda.trim().toLowerCase();

    return this.productos().filter((producto) => {

      const coincideCategoria =
        this.categoriaSeleccionada() === null ||
        producto.categoriaId === this.categoriaSeleccionada();

      const coincideBusqueda =
        !termino ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.categoriaNombre?.toLowerCase().includes(termino);

      return coincideCategoria && coincideBusqueda;
    });
  }

  seleccionarCategoria(id: number | null): void {
    this.categoriaSeleccionada.set(id);
  }

  verDetalle(producto: ProductoTienda): void {
    this.router.navigate([
      '/tienda/producto',
      producto.id
    ]);
  }

  agregarAlCarrito(
    evento: Event,
    producto: ProductoTienda
  ): void {

    evento.stopPropagation();

    this.carritoService.agregar(producto);

    // Abrir el carrito después de agregar el producto
    if (this.carritoComponent) {
      this.carritoComponent.abrir();
    }
  }

  cerrarSesion(): void {

    this.carritoService.cerrarSesion();

    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioEmail');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('rol');
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }

  private cargarCatalogo(): void {

    this.productoService.obtenerProductos().subscribe({

      next: (productos) => {

        this.productos.set(
          productos.filter(
            (producto) => producto.stock > 0
          )
        );

        this.cargando.set(false);
      },

      error: () => {

        this.error.set(
          'No fue posible cargar el catálogo de muebles.'
        );

        this.cargando.set(false);
      },

    });
  }
}