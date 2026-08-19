import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface ProductoAtributo {
  id?: number;
  atributoId: number;
  atributoNombre?: string;
  valor: string;
  unidad?: string;
  productoId?: number;
}

export interface ProductoAdmin {
  id?: number;
  sku: string;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  precioCosto: number;
  stock: number;
  imagen?: string;
  activo: boolean;
  categoriaId?: number;
  categoriaNombre?: string;
  marcaId?: number;
  marcaNombre?: string;
  proveedorId?: number;
  proveedorNombre?: string;
  atributos?: ProductoAtributo[];
}

/** Supports both the current API field and the legacy `imagenUrl` field. */
interface ProductoApi extends ProductoAdmin {
  imagenUrl?: string;
}

interface ProductoTiendaApi extends ProductoTienda {
  imagenUrl?: string;
}

export interface ProductoTienda {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  stock: number;
  imagen?: string;
  categoriaId?: number;
  categoriaNombre?: string;
  marcaNombre?: string;
  atributos?: ProductoAtributo[];
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly apiUrl = 'https://homestyle-backend-production.up.railway.app/api/productos';
  private readonly productoAtributosUrl = 'https://homestyle-backend-production.up.railway.app/api/producto-atributos';
  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<ProductoTienda[]> {
    return this.http
      .get<ProductoTiendaApi[]>(this.apiUrl, { headers: this.headers() })
      .pipe(map((productos) => productos.map((producto) => this.normalizarImagen(producto))));
  }

  obtenerProductosAdmin(): Observable<ProductoAdmin[]> {
    return this.http
      .get<ProductoApi[]>(this.apiUrl, { headers: this.headers() })
      .pipe(map((productos) => productos.map((producto) => this.normalizarImagen(producto))));
  }

  obtenerProducto(id: number): Observable<ProductoTienda> {
    return this.http
      .get<ProductoTiendaApi>(`${this.apiUrl}/${id}`, { headers: this.headers() })
      .pipe(map((producto) => this.normalizarImagen(producto)));
  }

  obtenerAtributosProducto(productoId: number): Observable<ProductoAtributo[]> {
    return this.http.get<ProductoAtributo[]>(
      `${this.productoAtributosUrl}/producto/${productoId}`,
      { headers: this.headers() },
    );
  }

  guardarAtributosProducto(
    productoId: number,
    atributos: Pick<ProductoAtributo, 'atributoId' | 'valor'>[],
  ): Observable<ProductoAtributo[]> {
    return this.http.put<ProductoAtributo[]>(
      `${this.productoAtributosUrl}/producto/${productoId}`,
      atributos,
      { headers: this.headers() },
    );
  }

  crearProducto(producto: ProductoAdmin, imagen?: File | null): Observable<ProductoAdmin> {
    return this.http
      .post<ProductoApi>(this.apiUrl, this.crearFormData(producto, imagen), {
        headers: this.headers(),
      })
      .pipe(map((respuesta) => this.normalizarImagen(respuesta)));
  }

  actualizarProducto(
    id: number,
    producto: ProductoAdmin,
    imagen?: File | null,
  ): Observable<ProductoAdmin> {
    return this.http
      .put<ProductoApi>(`${this.apiUrl}/${id}`, this.crearFormData(producto, imagen), {
        headers: this.headers(),
      })
      .pipe(map((respuesta) => this.normalizarImagen(respuesta)));
  }
  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  /**
   * The API expects the product data as a JSON part and the optional image as a
   * file part. Do not set Content-Type here: HttpClient adds the multipart
   * boundary required by Spring when it receives FormData.
   */
  private crearFormData(producto: ProductoAdmin, imagen?: File | null): FormData {
    const { imagen: _imagenActual, ...datosProducto } = producto;
    const datos = new FormData();
    datos.append(
      'producto',
      new Blob([JSON.stringify(datosProducto)], { type: 'application/json' }),
    );
    if (imagen) datos.append('imagen', imagen, imagen.name);
    return datos;
  }

  private normalizarImagen<T extends { imagen?: string; imagenUrl?: string }>(producto: T): T {
    return { ...producto, imagen: producto.imagen ?? producto.imagenUrl };
  }
}
