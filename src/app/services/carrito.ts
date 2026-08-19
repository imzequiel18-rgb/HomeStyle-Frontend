import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProductoTienda } from './producto';

export interface ProductoCarrito extends ProductoTienda {
  cantidad: number;
}

export interface CarritoItemDTO {
  productoId: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  imagen?: string;
  stock: number;
  cantidad: number;
}

export interface CarritoDTO {
  id: number;
  totalProductos: number;
  totalCompra: number;
  items: CarritoItemDTO[];
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private usuarioActual: string | null = null;
  private readonly apiUrl = 'https://homestyle-backend-production.up.railway.app/api/carrito';
  //private readonly uploadsUrl = 'https://homestyle-backend-production.up.railway.app/uploads';
  private readonly uploadsUrl = 'https://homestyle-backend-production.up.railway.app/uploads';
  private readonly carritoSubject = new BehaviorSubject<ProductoCarrito[]>([]);
  readonly carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) {}

  establecerUsuario(usuarioId: string | null): void {
    this.usuarioActual = usuarioId?.trim() || null;
    if (!this.usuarioActual) {
      this.carritoSubject.next([]);
      return;
    }

    const usuarioSolicitado = this.usuarioActual;
    this.http.get<CarritoDTO>(this.apiUrl, { headers: this.headers() }).subscribe({
      next: (carrito) => {
        if (this.usuarioActual === usuarioSolicitado) {
          this.publicar(carrito);
        }
      },
      error: () => {
        if (this.usuarioActual === usuarioSolicitado) {
          this.carritoSubject.next([]);
        }
      },
    });
  }

  /** Sincroniza el carrito visual con el carrito persistente del backend. */
  recargar(): Observable<CarritoDTO> {
    return this.http
      .get<CarritoDTO>(this.apiUrl, { headers: this.headers() })
      .pipe(tap((carrito) => this.publicar(carrito)));
  }

  cerrarSesion(): void {
    this.usuarioActual = null;
    this.carritoSubject.next([]);
  }

  agregar(producto: ProductoTienda): void {
    const usuarioSolicitado = this.usuarioActual;
    this.http
      .post<CarritoDTO>(`${this.apiUrl}/items`, { productoId: producto.id, cantidad: 1 }, { headers: this.headers() })
      .subscribe({ next: (carrito) => this.publicarSiCorresponde(usuarioSolicitado, carrito) });
  }

  cambiarCantidad(id: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminar(id);
      return;
    }

    const usuarioSolicitado = this.usuarioActual;
    this.http
      .put<CarritoDTO>(`${this.apiUrl}/items/${id}`, { productoId: id, cantidad }, { headers: this.headers() })
      .subscribe({ next: (carrito) => this.publicarSiCorresponde(usuarioSolicitado, carrito) });
  }

  eliminar(id: number): void {
    const usuarioSolicitado = this.usuarioActual;
    this.http
      .delete<CarritoDTO>(`${this.apiUrl}/items/${id}`, { headers: this.headers() })
      .subscribe({ next: (carrito) => this.publicarSiCorresponde(usuarioSolicitado, carrito) });
  }

  vaciar(): void {
    const usuarioSolicitado = this.usuarioActual;
    this.http.delete<CarritoDTO>(this.apiUrl, { headers: this.headers() }).subscribe({
      next: (carrito) => this.publicarSiCorresponde(usuarioSolicitado, carrito),
    });
  }

  private publicar(carrito: CarritoDTO): void {
    this.carritoSubject.next(
      (carrito.items ?? []).map((item) => ({
        id: item.productoId,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precioVenta: item.precioVenta,
        imagen: this.resolverImagen(item.imagen),
        stock: item.stock,
        cantidad: item.cantidad,
      })),
    );
  }

  private publicarSiCorresponde(usuarioSolicitado: string | null, carrito: CarritoDTO): void {
    if (this.usuarioActual === usuarioSolicitado) {
      this.publicar(carrito);
    }
  }

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private resolverImagen(imagen?: string): string | undefined {
    if (!imagen) return undefined;
    if (/^https?:\/\//i.test(imagen)) return imagen;
    return `${this.uploadsUrl}/${imagen.replace(/^\/+(uploads\/)?/i, '')}`;
  }
}
