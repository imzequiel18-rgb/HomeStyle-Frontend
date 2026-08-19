import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PedidoDetalleDTO,
  PedidoService
} from '../../services/pedido';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-pedido.html',
  styleUrl: './detalle-pedido.css'
})
export class DetallePedidoComponent implements OnInit {
  pedido = signal<PedidoDetalleDTO | null>(null);
  cargando = signal(true);
  error = signal('');
  cancelando = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.pedidoService.obtenerDetallePedido(id).subscribe({
      next: pedido => {
        this.pedido.set(pedido);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar el pedido.');
        this.cargando.set(false);
      }
    });
  }

  cancelarPedido(): void {
    const pedido = this.pedido();
    if (!pedido || pedido.estado !== 'PENDIENTE' || this.cancelando()) {
      return;
    }

    if (!window.confirm(`¿Seguro que deseas cancelar el pedido ${pedido.numeroPedido}?`)) {
      return;
    }

    this.cancelando.set(true);
    this.error.set('');

    this.pedidoService.cancelarPedido(pedido.id).subscribe({
      next: () => {
        this.pedido.update((actual) => actual ? { ...actual, estado: 'CANCELADO' } : actual);
        this.cancelando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const mensajeBackend = typeof err.error === 'string'
          ? err.error
          : err.error?.message || err.error?.error;
        this.error.set(mensajeBackend || 'No fue posible cancelar el pedido.');
        this.cancelando.set(false);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/mis-pedidos']);
  }
}
