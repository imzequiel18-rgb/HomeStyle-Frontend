import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


import { AdminPedidoService, PedidoAdmin } from '../../services/admin-pedido';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pedidos.html',
  styleUrl: '../admin-module.css',
})




export class AdminPedidos implements OnInit {
  pedidos = signal<PedidoAdmin[]>([]);

  mensaje = signal('');

  error = signal('');

  busqueda = signal('');

  estadoFiltro = signal('TODOS');

  constructor(
    private pedidoService: AdminPedidoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.pedidoService.obtenerPedidos().subscribe({
      next: (pedidos) => this.pedidos.set(pedidos),

      error: () => this.error.set('No se pudieron cargar los pedidos.'),
    });
  }

  cambiarEstado(pedido: PedidoAdmin, evento: Event) {
    const estado = (evento.target as HTMLSelectElement).value;

    this.pedidoService.actualizarEstado(pedido.id, estado).subscribe({
      next: () => {
        pedido.estado = estado;

        this.mensaje.set('Estado actualizado.');
      },

      error: (err) => {
        this.error.set(err.error);

        this.cargar();
      },
    });
  }

  get pedidosFiltrados(): PedidoAdmin[] {
    return this.pedidos().filter((pedido) => {
      const coincideBusqueda =
        pedido.numeroPedido.toLowerCase().includes(this.busqueda().toLowerCase()) ||
        pedido.cliente.toLowerCase().includes(this.busqueda().toLowerCase());

      const coincideEstado =
        this.estadoFiltro() === 'TODOS' || pedido.estado === this.estadoFiltro();

      return coincideBusqueda && coincideEstado;
    });
  }

  get pendientes(): number {
    return this.pedidos().filter((p) => p.estado === 'PENDIENTE').length;
  }

  get pagados(): number {
    return this.pedidos().filter((p) => p.estado === 'PAGADO').length;
  }

  get enviados(): number {
    return this.pedidos().filter((p) => p.estado === 'ENVIADO').length;
  }

  get entregados(): number {
    return this.pedidos().filter((p) => p.estado === 'ENTREGADO').length;
  }

  get cancelados(): number {
    return this.pedidos().filter((p) => p.estado === 'CANCELADO').length;
  }

  verDetalle(id: number): void {
    this.router.navigate(['/admin/pedidos', id]);
  }
}
