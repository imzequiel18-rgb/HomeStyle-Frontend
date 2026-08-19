import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PedidoDTO {
  id: number;
  fecha: string;
  estado: string;
  total: number;
  usuario: string;
}

export interface PedidoResumenDTO {
  id: number;
  folio: string;
  fecha: string;
  estado: string;
  total: number;
  numeroPedido?: string;
  metodoPago?: string;
  direccionEnvio?: string;
}

export interface DetallePedidoDTO {
  productoId: number;
  nombreProducto: string;
  imagen: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoDetalleDTO {
  id: number;
  numeroPedido: string;
  fecha: string;
  estado: string;
  metodoPago: string;
  direccionEnvio: string;
  mercadoPagoPaymentId?: string;
  mercadoPagoStatus?: string;
  mercadoPagoStatusDetail?: string;
  total: number;
  productos: DetallePedidoDTO[];
}

export interface MercadoPagoPreferenceDTO {
  pedidoId: number;
  numeroPedido: string;
  preferenceId: string;
  checkoutUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(private http: HttpClient) {}

  /**
   * Finaliza una compra utilizando
   * el flujo tradicional.
   */
  finalizarCompra(): Observable<PedidoDTO> {
    return this.http.post<PedidoDTO>(`${this.apiUrl}/finalizar`, null, {
      headers: this.headers(),
    });
  }

  /**
   * Obtiene los pedidos del usuario
   * autenticado.
   */
  obtenerMisPedidos(): Observable<PedidoResumenDTO[]> {
    return this.http.get<PedidoResumenDTO[]>(`${this.apiUrl}/mis-pedidos`, {
      headers: this.headers(),
    });
  }

  /**
   * Obtiene el detalle de un pedido.
   */
  obtenerDetallePedido(id: number): Observable<PedidoDetalleDTO> {
    return this.http.get<PedidoDetalleDTO>(`${this.apiUrl}/${id}`, {
      headers: this.headers(),
    });
  }

  /**
   * Cancela un pedido PENDIENTE del usuario autenticado.
   */
  cancelarPedido(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancelar`, null, {
      headers: this.headers(),
    });
  }

  /**
   * Crea una preferencia de Mercado Pago
   * para el carrito del usuario autenticado.
   */
  iniciarPagoMercadoPago(): Observable<MercadoPagoPreferenceDTO> {
    return this.http.post<MercadoPagoPreferenceDTO>(`${this.apiUrl}/pagar/mercadopago`, null, {
      headers: this.headers(),
    });
  }

  confirmarPagoMercadoPago(paymentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/mercadopago/confirmar/${paymentId}`, null, {
      headers: this.headers(),
    });
  }

  /**
   * Obtiene el JWT del usuario actual.
   */
  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');

    return token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : new HttpHeaders();
  }
}
