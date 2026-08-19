import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminService, Reporte } from '../../services/admin';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reportes.html',
  styleUrl: './admin-reportes.css'
})
export class AdminReportes implements OnInit {

  reporte = signal<Reporte | null>(null);

  cargando = signal(true);
  menuExportacionAbierto = signal(false);

  constructor(
    private adminService: AdminService
  ) {}

  ngOnInit(): void {

    this.adminService.obtenerReporteGeneral().subscribe({

      next: (data) => {

        this.reporte.set(data);

        this.cargando.set(false);

      },

      error: (err) => {

        console.error(err);

        this.cargando.set(false);

      }

    });

  }

  alternarMenuExportacion(): void {
    this.menuExportacionAbierto.update((abierto) => !abierto);
  }

  async exportarExcel(): Promise<void> {
    const reporte = this.reporte();

    if (!reporte) return;

    const XLSX = await import('xlsx');

    const libro = XLSX.utils.book_new();
    const resumen = [
      ['Reporte administrativo'],
      ['Generado el', new Date().toLocaleString('es-MX')],
      [],
      ['Indicador', 'Valor'],
      ['Ventas totales', reporte.ventasTotales],
      ['Total de pedidos', reporte.totalPedidos],
      ['Total de clientes', reporte.totalClientes],
      ['Total de productos', reporte.totalProductos],
    ];

    const hojaResumen = XLSX.utils.aoa_to_sheet(resumen);
    hojaResumen['!cols'] = [{ wch: 26 }, { wch: 22 }];
    XLSX.utils.book_append_sheet(libro, hojaResumen, 'Resumen');

    this.agregarHoja(XLSX, libro, 'Stock bajo', ['Producto', 'Stock'], reporte.productosStockBajo.map((p) => [p.nombre, p.stock]));
    this.agregarHoja(XLSX, libro, 'Más vendidos', ['Producto', 'Vendidos'], reporte.productosMasVendidos.map((p) => [p.nombre, p.vendidos]));
    this.agregarHoja(XLSX, libro, 'Últimos pedidos', ['Pedido', 'Cliente', 'Fecha', 'Estado', 'Total'], reporte.ultimosPedidos.map((p) => [p.numeroPedido, p.cliente, p.fecha, p.estado, p.total]));

    XLSX.writeFile(libro, `${this.nombreArchivo()}.xlsx`);
    this.menuExportacionAbierto.set(false);
  }

  async exportarPdf(): Promise<void> {
    const reporte = this.reporte();

    if (!reporte) return;

    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ]);

    const documento = new jsPDF();
    documento.setFontSize(18);
    documento.text('Reporte administrativo', 14, 18);
    documento.setFontSize(10);
    documento.text(`Generado el ${new Date().toLocaleString('es-MX')}`, 14, 25);

    autoTable(documento, {
      startY: 31,
      head: [['Indicador', 'Valor']],
      body: [
        ['Ventas totales', this.formatearMoneda(reporte.ventasTotales)],
        ['Total de pedidos', String(reporte.totalPedidos)],
        ['Total de clientes', String(reporte.totalClientes)],
        ['Total de productos', String(reporte.totalProductos)],
      ],
      headStyles: { fillColor: [157, 92, 62] },
    });

    let posicionY = (documento as any).lastAutoTable.finalY + 10;
    posicionY = this.agregarTablaPdf(autoTable, documento, 'Productos con menor stock', ['Producto', 'Stock'], reporte.productosStockBajo.map((p) => [p.nombre, String(p.stock)]), posicionY);
    posicionY = this.agregarTablaPdf(autoTable, documento, 'Productos más vendidos', ['Producto', 'Vendidos'], reporte.productosMasVendidos.map((p) => [p.nombre, String(p.vendidos)]), posicionY);
    this.agregarTablaPdf(autoTable, documento, 'Últimos pedidos', ['Pedido', 'Cliente', 'Fecha', 'Estado', 'Total'], reporte.ultimosPedidos.map((p) => [p.numeroPedido, p.cliente, p.fecha, p.estado, this.formatearMoneda(p.total)]), posicionY);

    documento.save(`${this.nombreArchivo()}.pdf`);
    this.menuExportacionAbierto.set(false);
  }

  private agregarHoja(XLSX: any, libro: any, nombre: string, encabezados: string[], filas: (string | number)[][]): void {
    const hoja = XLSX.utils.aoa_to_sheet([encabezados, ...filas]);
    hoja['!cols'] = encabezados.map(() => ({ wch: 22 }));
    XLSX.utils.book_append_sheet(libro, hoja, nombre);
  }

  private agregarTablaPdf(autoTable: any, documento: any, titulo: string, encabezados: string[], filas: string[][], posicionY: number): number {
    if (posicionY > 245) {
      documento.addPage();
      posicionY = 18;
    }

    documento.setFontSize(13);
    documento.text(titulo, 14, posicionY);
    autoTable(documento, {
      startY: posicionY + 5,
      head: [encabezados],
      body: filas,
      headStyles: { fillColor: [157, 92, 62] },
    });

    return (documento as any).lastAutoTable.finalY + 10;
  }

  private nombreArchivo(): string {
    return `reporte-administrativo-${new Date().toISOString().slice(0, 10)}`;
  }

  private formatearMoneda(cantidad: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cantidad);
  }

}
