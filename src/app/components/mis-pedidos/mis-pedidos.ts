import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoResumenDTO, PedidoService } from '../../services/pedido';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.css',
})
export class MisPedidosComponent implements OnInit {
  pedidos = signal<PedidoResumenDTO[]>([]);
  cargando = signal(true);
  error = signal('');
  mensaje = signal('');
  cancelandoId = signal<number | null>(null);

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  private cargarPedidos(): void {
    this.pedidoService.obtenerMisPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos.set(pedidos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar tus pedidos.');
        this.cargando.set(false);
      },
    });
  }

  volverATienda(): void {
    this.router.navigate(['/tienda']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/mis-pedidos', id]);
  }

  cancelarPedido(pedido: PedidoResumenDTO): void {
    if (pedido.estado !== 'PENDIENTE' || this.cancelandoId() !== null) {
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que deseas cancelar el pedido ${pedido.numeroPedido ?? pedido.id}? Esta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    this.error.set('');
    this.mensaje.set('');
    this.cancelandoId.set(pedido.id);

    this.pedidoService.cancelarPedido(pedido.id).subscribe({
      next: () => {
        this.pedidos.update((pedidos) =>
          pedidos.map((item) =>
            item.id === pedido.id ? { ...item, estado: 'CANCELADO' } : item
          )
        );
        this.mensaje.set('Tu pedido fue cancelado correctamente.');
        this.cancelandoId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        const mensajeBackend =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message || err.error?.error;

        this.error.set(
          mensajeBackend || 'No fue posible cancelar el pedido. Intenta nuevamente.'
        );
        this.cancelandoId.set(null);
      },
    });
  }
}
