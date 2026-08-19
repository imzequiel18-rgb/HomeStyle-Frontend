import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PedidoAdmin {
  id: number;
  numeroPedido: string;
  cliente: string;
  fecha: string;
  estado: string;
  total: number;
  metodoPago: string;
  direccionEnvio: string;
}

export interface DetallePedido {
  productoId: number;
  nombreProducto: string;
  imagen: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoDetalle {
  id: number;
  numeroPedido: string;
  fecha: string;
  estado: string;
  metodoPago: string;
  direccionEnvio: string;
  total: number;
  productos: DetallePedido[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminPedidoService {
  //private readonly API = 'https://homestyle-backend-production.up.railway.app/api/admin/pedidos';
  private readonly API = 'https://homestyle-backend-production.up.railway.app/api/admin/pedidos';

  constructor(private http: HttpClient) {}

  obtenerPedidos(): Observable<PedidoAdmin[]> {
    return this.http.get<PedidoAdmin[]>(this.API);
  }

  actualizarEstado(id: number, estado: string): Observable<any> {
    const params = new HttpParams().set('estado', estado);

    return this.http.put(`${this.API}/${id}/estado`, {}, { params });
  }

  obtenerDetallePedido(id: number) {
    return this.http.get<PedidoDetalle>(`${this.API}/${id}`);
  }
}
