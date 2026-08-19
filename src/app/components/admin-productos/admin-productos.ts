import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria, CategoriaService } from '../../services/categoria';
import { CatalogoService, CategoriaAtributo, Marca } from '../../services/catalogo';
import { ProductoAdmin, ProductoAtributo, ProductoService } from '../../services/producto';
import { Proveedor, ProveedorService } from '../../services/proveedor';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-productos.html',
  styleUrl: '../admin-module.css',
})
export class AdminProductos implements OnInit {
  private readonly maxImageBytes = 8 * 1024 * 1024;
  private previewObjectUrl: string | null = null;
  productos = signal<ProductoAdmin[]>([]);
  busquedaSku = signal('');
  productosFiltrados = computed(() => {
    const sku = this.busquedaSku().trim().toLocaleLowerCase();

    if (!sku) return this.productos();

    return this.productos().filter((producto) =>
      producto.sku.toLocaleLowerCase().includes(sku),
    );
  });
  categorias = signal<Categoria[]>([]);
  proveedores = signal<Proveedor[]>([]);
  marcas = signal<Marca[]>([]);
  atributosCategoria = signal<CategoriaAtributo[]>([]);
  atributosFormulario: ProductoAtributo[] = [];
  mensaje = signal('');
  error = signal('');
  imagenSeleccionada = signal('');
  archivoImagen: File | null = null;
  editandoId: number | null = null;
  form = this.nuevo();
  
  constructor(
    private productosService: ProductoService,
    private categoriasService: CategoriaService,
    private proveedoresService: ProveedorService,
    private catalogo: CatalogoService,
  ) {}

  ngOnInit(): void {
    this.recargar();
    this.categoriasService.obtenerCategorias().subscribe({ next: (x) => this.categorias.set(x) });
    this.proveedoresService
      .obtenerProveedores()
      .subscribe({ next: (x) => this.proveedores.set(x) });
    this.catalogo.marcas().subscribe({ next: (x) => this.marcas.set(x) });
  }

  guardar(): void {
    this.error.set('');
    if (!this.form.categoriaId || !this.form.proveedorId || !this.form.marcaId) {
      this.error.set('Selecciona categoría, marca y proveedor.');
      return;
    }
    const obligatorioSinValor = this.atributosCategoria().find(
      (atributo) => atributo.obligatorio && !this.valorAtributo(atributo.atributoId).trim(),
    );
    if (obligatorioSinValor) {
      this.error.set(`La especificación "${obligatorioSinValor.atributoNombre}" es obligatoria.`);
      return;
    }
    const req = this.editandoId
      ? this.productosService.actualizarProducto(this.editandoId, this.form, this.archivoImagen)
      : this.productosService.crearProducto(this.form, this.archivoImagen);
    req.subscribe({
      next: (producto) => {
        if (!producto.id) {
          this.error.set('El producto se guardó, pero no se recibió su identificador para guardar especificaciones.');
          return;
        }
        this.productosService.guardarAtributosProducto(producto.id, this.atributosParaGuardar()).subscribe({
          next: () => this.finalizarGuardado(),
          error: (e) => this.error.set(e?.error?.message ?? 'El producto se guardó, pero no se pudieron guardar sus especificaciones.'),
        });
      },
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudo guardar el producto.'),
    });
  }

  cambioCategoria(): void {
    const categoriaId = this.form.categoriaId;
    this.atributosCategoria.set([]);
    this.atributosFormulario = [];
    if (!categoriaId) return;
    this.cargarAtributosCategoria(categoriaId);
  }

  editar(producto: ProductoAdmin): void {
    this.liberarVistaPrevia();
    this.editandoId = producto.id ?? null;
    this.form = { ...producto };
    this.imagenSeleccionada.set(producto.imagen ?? '');
    this.archivoImagen = null;
    this.atributosCategoria.set([]);
    this.atributosFormulario = [];
    if (producto.id && producto.categoriaId) {
      this.cargarAtributosCategoria(producto.categoriaId, producto.id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private finalizarGuardado(): void {
    this.mensaje.set(this.editandoId ? 'Producto actualizado.' : 'Producto creado.');
    this.cancelar();
    this.recargar();
  }

  seleccionarImagen(evento: Event): void {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) return;

    this.error.set('');
    const formatosPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!formatosPermitidos.includes(archivo.type)) {
      this.error.set('Selecciona una imagen JPG, PNG o WebP.');
      return;
    }
    if (archivo.size > this.maxImageBytes) {
      this.error.set('La imagen no puede superar los 8 MB.');
      return;
    }

    this.liberarVistaPrevia();
    this.archivoImagen = archivo;
    this.previewObjectUrl = URL.createObjectURL(archivo);
    this.imagenSeleccionada.set(this.previewObjectUrl);
  }

  quitarImagen(): void {
    this.liberarVistaPrevia();
    this.archivoImagen = null;
    this.imagenSeleccionada.set('');
  }

  eliminar(producto: ProductoAdmin): void {
    if (producto.id && confirm(`¿Desactivar ${producto.nombre}?`))
      this.productosService.eliminarProducto(producto.id).subscribe({
        next: () => {
          this.mensaje.set('Producto desactivado.');
          this.recargar();
        },
        error: () => this.error.set('No se pudo desactivar el producto.'),
      });
  }

  cancelar(): void {
    this.editandoId = null; 
    this.form = this.nuevo();
    this.archivoImagen = null;
    this.liberarVistaPrevia();
    this.imagenSeleccionada.set('');
    this.atributosCategoria.set([]);
    this.atributosFormulario = [];
  }

  actualizarBusquedaSku(valor: string): void {
    this.busquedaSku.set(valor);
  }

  private recargar(): void { 
    this.productosService
      .obtenerProductosAdmin() 
      .subscribe({
        next: (x) => this.productos.set(x),
        error: () => this.error.set('No se pudieron cargar los productos.'),
      });
  }

  
  private nuevo(): ProductoAdmin {
    return {
      sku: '',
      nombre: '',
      descripcion: '',
      precioVenta: 0,
      precioCosto: 0,
      stock: 0,
      imagen: '',
      activo: true,
    };
  }

  private cargarAtributosCategoria(categoriaId: number, productoId?: number): void {
    const valores$ = productoId
      ? this.productosService.obtenerAtributosProducto(productoId)
      : of<ProductoAtributo[]>([]);

    forkJoin({
      atributos: this.categoriasService.obtenerAtributosCategoria(categoriaId),
      valores: valores$,
    }).subscribe({
      next: ({ atributos, valores }) => {
        if (this.form.categoriaId !== categoriaId) return;
        this.atributosCategoria.set([...atributos].sort((a, b) => a.orden - b.orden));
        this.atributosFormulario = atributos.map((atributo) => ({
          atributoId: atributo.atributoId,
          valor: valores.find((valor) => valor.atributoId === atributo.atributoId)?.valor ?? '',
        }));
      },
      error: () => {
        if (this.form.categoriaId === categoriaId) {
          this.atributosCategoria.set([]);
          this.atributosFormulario = [];
          this.error.set('No se pudieron cargar las especificaciones de la categoría.');
        }
      },
    });
  }

  valorAtributo(atributoId: number): string {
    return this.atributosFormulario.find((atributo) => atributo.atributoId === atributoId)?.valor ?? '';
  }

  actualizarValorAtributo(atributoId: number, valor: string | number): void {
    const atributo = this.atributosFormulario.find((item) => item.atributoId === atributoId);
    if (atributo) atributo.valor = String(valor ?? '');
  }

  esNumero(tipoDato?: string): boolean {
    return tipoDato === 'NUMERO';
  }

  private atributosParaGuardar(): Pick<ProductoAtributo, 'atributoId' | 'valor'>[] {
    return this.atributosFormulario.map(({ atributoId, valor }) => ({ atributoId, valor: valor.trim() }));
  }

  private liberarVistaPrevia(): void {
    if (this.previewObjectUrl) URL.revokeObjectURL(this.previewObjectUrl);
    this.previewObjectUrl = null;
  }
}
