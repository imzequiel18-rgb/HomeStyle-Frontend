import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../services/pedido';

@Component({
  selector: 'app-pago-resultado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago-resultado.html',
  styleUrl: './pago-resultado.css'
})
export class PagoResultadoComponent implements OnInit {
  estado = signal<'approved' | 'pending' | 'rejected' | 'unknown'>('unknown');
  paymentId = signal('');
  sincronizando = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const status = (params.get('status') || params.get('collection_status') || '').toLowerCase();
    const paymentId = params.get('payment_id') || params.get('collection_id') || '';

    this.paymentId.set(paymentId);
    this.estado.set(
      status === 'approved' ? 'approved' :
      status === 'pending' || status === 'in_process' ? 'pending' :
      status === 'rejected' || status === 'cancelled' ? 'rejected' : 'unknown'
    );

    if (paymentId) {
      this.sincronizando.set(true);
      this.pedidoService.confirmarPagoMercadoPago(paymentId).subscribe({
        next: () => this.sincronizando.set(false),
        error: () => this.sincronizando.set(false)
      });
    }
  }

  irAPedidos(): void {
    this.router.navigate(['/mis-pedidos']);
  }

  volverTienda(): void {
    this.router.navigate(['/tienda']);
  }
}
