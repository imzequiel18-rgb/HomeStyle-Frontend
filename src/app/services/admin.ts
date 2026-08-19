  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  
  export interface Categoria {
    id?: number;
    nombre: string;
  }
  
  export interface Proveedor {
    id?: number;
    nombre: string;
    correo: string;
    telefono: string;
  }
  
  export interface ProductoAdmin {
    id?: number;
    nombre: string;
    descripcion: string;
    precioVenta: number;
    dimensiones: number;
    peso: number;
    stock: number;
    imagenUrl?: string;
    precioCosto: number;
    ubicacionBodega: string;
    categoriaId?: number;
    categoriaNombre?: string;
    proveedorId?: number;
    proveedorNombre?: string;
  }
  
  export interface ProductoStock {
  
    nombre: string;
    stock: number;
  
  }
  
  export interface ProductoVendido {
  
    nombre: string;
    vendidos: number;
  
  }
  
  export interface PedidoReciente {
  
    numeroPedido: string;
    cliente: string;
    fecha: string;
    estado: string;
    total: number;
  
  }
  
  export interface Reporte {
    ventasTotales: number;
    totalPedidos: number;
    totalClientes: number;
    totalProductos: number;
    productosStockBajo: ProductoStock[];
    productosMasVendidos: ProductoVendido[];
    ultimosPedidos: PedidoReciente[];
  }
  
  export interface Direccion{
    id:number;
    nombreDestinatario:string;
    telefonoContacto:string;
    calle:string;
    numeroExterior:string;
    numeroInterior:string;
    colonia:string;
    ciudad:string;
    estado:string;
    codigoPostal:string;
    referencias:string;
    latitud?:number | null;
    longitud?:number | null;
    predeterminada:boolean;
  }
  
  @Injectable({
    providedIn: 'root',
  })
  
  export class AdminService {
    private apiUrl = 'http://localhost:8080/api';
  
    constructor(private http: HttpClient) {}
  
    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
  
      return token
        ? new HttpHeaders({ Authorization: `Bearer ${token}` })
        : new HttpHeaders();
    }
  
    obtenerProductos(): Observable<ProductoAdmin[]> {
      return this.http.get<ProductoAdmin[]>(`${this.apiUrl}/productos/admin`, {
        headers: this.getHeaders(),
      });
    }
  
    crearProducto(producto: ProductoAdmin): Observable<ProductoAdmin> {
      return this.http.post<ProductoAdmin>(`${this.apiUrl}/productos`, this.toProductoPayload(producto), {
        headers: this.getHeaders(),
      });
    }
  
    actualizarProducto(id: number, producto: ProductoAdmin): Observable<ProductoAdmin> {
      return this.http.put<ProductoAdmin>(
        `${this.apiUrl}/productos/${id}`,
        this.toProductoPayload(producto),
        { headers: this.getHeaders() },
      );
    }
  
    eliminarProducto(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/productos/${id}`, {
        headers: this.getHeaders(),
      });
    }
  
    obtenerProveedores(): Observable<Proveedor[]> {
      return this.http.get<Proveedor[]>(`${this.apiUrl}/proveedores`, {
        headers: this.getHeaders(),
      });
    }
  
    crearProveedor(proveedor: Proveedor): Observable<Proveedor> {
      return this.http.post<Proveedor>(`${this.apiUrl}/proveedores`, proveedor, {
        headers: this.getHeaders(),
      });
    }
  
    actualizarProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
      return this.http.put<Proveedor>(`${this.apiUrl}/proveedores/${id}`, proveedor, {
        headers: this.getHeaders(),
      });
    }
  
    eliminarProveedor(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/proveedores/${id}`, {
        headers: this.getHeaders(),
      });
    }
  
    obtenerCategorias(): Observable<Categoria[]> {
      return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`, {
        headers: this.getHeaders(),
      });
    }
  
    crearCategoria(categoria: Categoria): Observable<Categoria> {
      return this.http.post<Categoria>(`${this.apiUrl}/categorias`, categoria, {
        headers: this.getHeaders(),
      });
    }
  
    actualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
      return this.http.put<Categoria>(`${this.apiUrl}/categorias/${id}`, categoria, {
        headers: this.getHeaders(),
      });
    }
  
    eliminarCategoria(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/categorias/${id}`, {
        headers: this.getHeaders(),
      });
    }
  
    private toProductoPayload(producto: ProductoAdmin) {
      return {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precioVenta: producto.precioVenta,
        dimensiones: producto.dimensiones,
        peso: producto.peso,
        stock: producto.stock,
        imagenUrl: producto.imagenUrl,
        precioCosto: producto.precioCosto,
        ubicacionBodega: producto.ubicacionBodega,
        proveedor: producto.proveedorId ? { id: producto.proveedorId } : null,
        categoria: producto.categoriaId ? { id: producto.categoriaId } : null,
      };
    }
  
    obtenerReporteGeneral(): Observable<Reporte> {
  
    return this.http.get<Reporte>(
      `${this.apiUrl}/admin/reportes`,
      {
        headers: this.getHeaders()
      }
    );
  
  }
  }
  