import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminPedidoService, PedidoDetalle } from '../../services/admin-pedido';

@Component({
  selector: 'app-admin-detalle-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-detalle-pedido.html',
  styleUrl: './admin-detalle-pedido.css',
})
export class AdminDetallePedido implements OnInit {
  pedido = signal<PedidoDetalle | null>(null);

  mensaje = signal('');

  error = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: AdminPedidoService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.pedidoService.obtenerDetallePedido(id).subscribe({
      next: (pedido) => {
        this.pedido.set(pedido);
      },

      error: () => {
        this.error.set('No fue posible cargar el pedido.');
      },
    });
  }

  volver() {
    this.router.navigate(['/admin/pedidos']);
  }
}
