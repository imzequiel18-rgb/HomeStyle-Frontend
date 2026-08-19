import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito';
import { ProductoAtributo, ProductoService, ProductoTienda } from '../../services/producto';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetalleComponent implements OnInit {
  producto = signal<ProductoTienda | null>(null);
  cargando = signal(true);
  error = signal('');
  agregado = signal(false);
  especificaciones = signal<ProductoAtributo[]>([]);

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private carritoService: CarritoService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.cargarProducto(id);
    });
  }

  private cargarProducto(id: number): void {
    this.cargando.set(true);
    this.error.set('');
    this.agregado.set(false);
    this.especificaciones.set([]);

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('El producto solicitado no es válido.');
      this.cargando.set(false);
      return;
    }

    this.productoService.obtenerProducto(id).subscribe({
      next: (producto) => {
        this.producto.set(producto);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar este producto.');
        this.cargando.set(false);
      },
    });

    this.productoService.obtenerAtributosProducto(id).subscribe({
      next: (atributos) => this.especificaciones.set(atributos),
      error: () => this.especificaciones.set([]),
    });
  }

  agregarAlCarrito(): void {
    const producto = this.producto();
    if (!producto) return;
    this.carritoService.agregar(producto);
    this.agregado.set(true);
  }
}
