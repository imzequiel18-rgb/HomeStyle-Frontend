import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import {
  CarritoService, 
  ProductoCarrito,
} from '../../services/carrito';

import { PedidoService } from '../../services/pedido';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit, OnDestroy {

  carrito = signal<ProductoCarrito[]>([]);
  abierto = signal(false);

  finalizandoCompra = signal(false);
  notificacionCompra = signal('');
  errorCompra = signal('');

  private notificacionTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
  ) {}

  ngOnInit(): void {

    this.carritoService.carrito$.subscribe((carrito) => {
      this.carrito.set(carrito);
    });

  }

  ngOnDestroy(): void {

    if (this.notificacionTimeout) {
      clearTimeout(this.notificacionTimeout);
    }

  }

  abrir(): void {
    this.abierto.set(true);
  }

  cerrar(): void {
    this.abierto.set(false);
  }

  toggle(): void {
    this.abierto.set(!this.abierto());
  }

  get cantidadCarrito(): number {

    return this.carrito().reduce(
      (total, producto) =>
        total + producto.cantidad,
      0,
    );

  }

  get totalCarrito(): number {

    return this.carrito().reduce(
      (total, producto) =>
        total + producto.precioVenta * producto.cantidad,
      0,
    );

  }

  cambiarCantidad(
    producto: ProductoCarrito,
    cambio: number,
  ): void {

    const nuevaCantidad = Math.min(
      producto.stock,
      producto.cantidad + cambio,
    );

    this.carritoService.cambiarCantidad(
      producto.id,
      nuevaCantidad,
    );
  }

  eliminarDelCarrito(
    producto: ProductoCarrito,
  ): void {

    if (this.finalizandoCompra()) {
      return;
    }

    this.carritoService.eliminar(
      producto.id,
    );
  }

  finalizarCompra(): void {

    if (
      this.finalizandoCompra() ||
      this.carrito().length === 0
    ) {
      return;
    }

    this.finalizandoCompra.set(true);
    this.errorCompra.set('');
    this.notificacionCompra.set('');

    this.pedidoService
      .iniciarPagoMercadoPago()
      .subscribe({

        next: (respuesta) => {

          if (!respuesta.checkoutUrl) {

            this.errorCompra.set(
              'Mercado Pago no devolvió la dirección del checkout.',
            );

            this.finalizandoCompra.set(false);

            return;
          }

          /*
           * El backend ya creó el pedido
           * en estado PENDIENTE y generó
           * la preferencia de Mercado Pago.
           *
           * Ahora enviamos al usuario
           * al checkout configurado por el backend.
           */
          window.location.href =
            respuesta.checkoutUrl;
        },

        error: (error: HttpErrorResponse) => {

          this.errorCompra.set(
            this.obtenerMensajeError(error),
          );

          this.finalizandoCompra.set(false);
        },

      });
  }

  private obtenerMensajeError(
    error: HttpErrorResponse,
  ): string {

    if (
      typeof error.error === 'string' &&
      error.error.trim()
    ) {
      return error.error;
    }

    if (error.status === 401) {
      return 'Tu sesión expiró. Inicia sesión nuevamente.';
    }

    if (error.status === 400) {
      return 'No fue posible iniciar el pago. Verifica tu carrito.';
    }

    if (error.status === 0) {
      return 'No fue posible conectar con el servidor.';
    }

    return 'No fue posible iniciar el pago con Mercado Pago.';
  }

  private mostrarNotificacionCompra(
    mensaje: string,
  ): void {

    if (this.notificacionTimeout) {
      clearTimeout(
        this.notificacionTimeout,
      );
    }

    this.notificacionCompra.set(
      mensaje,
    );

    this.notificacionTimeout =
      setTimeout(
        () => this.notificacionCompra.set(''),
        4000,
      );
  }
}