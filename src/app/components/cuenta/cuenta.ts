import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DireccionService } from '../../services/direccion';
import { Direccion } from '../../services/admin';
import {
  ActualizarPerfilRequest,
  CambiarPasswordRequest,
  PerfilUsuario,
  UsuarioService,
} from '../../services/usuario';
import { PedidoResumenDTO, PedidoService } from '../../services/pedido';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.css',
})
export class CuentaComponent implements OnInit {

  seccion = signal<'perfil' | 'direcciones' | 'pedidos'>('perfil');
  direcciones = signal<Direccion[]>([]);
  mostrarFormulario = signal(false);
  editando = signal(false);
  direccionEditarId = signal<number | null>(null);
  modoEdicion = signal(false);
  cargandoPerfil = signal(true);
  guardandoPerfil = signal(false);
  actualizandoPassword = signal(false);
  mostrarPasswordActual = signal(false);
  mostrarPasswordNueva = signal(false);
  mostrarConfirmacionPassword = signal(false);
  perfilOriginal = signal<ActualizarPerfilRequest | null>(null);
  erroresPerfil: Record<string, string> = {};
  erroresPassword: Record<string, string> = {};
  mensajeExitoPerfil = signal('');
  mensajeExitoPassword = signal('');
  errorCargaPerfil = signal('');
  pedidos = signal<PedidoResumenDTO[]>([]);
  cargandoPedidos = signal(false);
  errorPedidos = signal('');
  obteniendoUbicacion = signal(false);
  mensajeUbicacion = signal('');
  errorUbicacion = signal('');
  mapaUrl = signal<SafeResourceUrl | null>(null);

  perfil: ActualizarPerfilRequest = { userName: '', email: '', phoneNumber: '' };
  password: CambiarPasswordRequest = {
    passwordActual: '', passwordNueva: '', confirmarPassword: '',
  };

  nuevaDireccion: Direccion = {
    id: 0,
    nombreDestinatario: '',
    telefonoContacto: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    referencias: '',
    predeterminada: false,
    latitud: null,
    longitud: null,
  };

  constructor(
    private direccionService: DireccionService,
    private usuarioService: UsuarioService,
    private pedidoService: PedidoService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.cargandoPerfil.set(true);
    this.errorCargaPerfil.set('');
    this.usuarioService.obtenerPerfil().subscribe({
      next: (respuesta: PerfilUsuario) => {
        const perfil = {
          userName: respuesta.userName ?? '',
          email: respuesta.email ?? '',
          phoneNumber: respuesta.phoneNumber ?? '',
        };
        this.perfil = { ...perfil };
        this.perfilOriginal.set(perfil);
        this.cargandoPerfil.set(false);
      },
      error: (error) => {
        this.errorCargaPerfil.set(this.obtenerMensajeError(error, 'No fue posible cargar tu perfil.'));
        this.cargandoPerfil.set(false);
      },
    });
  }

  perfilModificado(): boolean {
    const original = this.perfilOriginal();
    return !!original && (this.perfil.userName.trim() !== original.userName ||
      this.perfil.email.trim() !== original.email ||
      this.perfil.phoneNumber.trim() !== original.phoneNumber);
  }

  limpiarErroresPerfil() {
    this.erroresPerfil = {};
    this.mensajeExitoPerfil.set('');
  }

  limpiarErroresPassword() {
    this.erroresPassword = {};
    this.mensajeExitoPassword.set('');
  }

  guardarPerfil() {
    this.limpiarErroresPerfil();
    const perfil = {
      userName: this.perfil.userName.trim(),
      email: this.perfil.email.trim(),
      phoneNumber: this.perfil.phoneNumber.trim(),
    };
    if (!perfil.userName) this.erroresPerfil['userName'] = 'El usuario es obligatorio.';
    if (!perfil.email) this.erroresPerfil['email'] = 'El correo es obligatorio.';
    if (!perfil.phoneNumber) this.erroresPerfil['phoneNumber'] = 'El teléfono es obligatorio.';
    if (Object.keys(this.erroresPerfil).length) return;

    this.guardandoPerfil.set(true);
    this.usuarioService.actualizarPerfil(perfil).subscribe({
      next: (respuesta) => {
        this.perfil = {
          userName: respuesta.userName, email: respuesta.email, phoneNumber: respuesta.phoneNumber,
        };
        this.perfilOriginal.set({ ...this.perfil });
        this.mensajeExitoPerfil.set('Tus datos personales se actualizaron correctamente.');
        this.guardandoPerfil.set(false);
      },
      error: (error) => {
        this.asignarErrorPerfil(this.obtenerMensajeError(error, 'No fue posible guardar los cambios.'));
        this.guardandoPerfil.set(false);
      },
    });
  }

  actualizarPassword() {
    this.limpiarErroresPassword();
    if (!this.password.passwordActual) this.erroresPassword['passwordActual'] = 'La contraseña actual es obligatoria.';
    if (!this.password.passwordNueva) this.erroresPassword['passwordNueva'] = 'La nueva contraseña es obligatoria.';
    if (!this.password.confirmarPassword) this.erroresPassword['confirmarPassword'] = 'Confirma tu nueva contraseña.';
    if (this.password.passwordNueva && this.password.confirmarPassword &&
        this.password.passwordNueva !== this.password.confirmarPassword) {
      this.erroresPassword['confirmarPassword'] = 'La nueva contraseña y la confirmación no coinciden.';
    }
    if (Object.keys(this.erroresPassword).length) return;

    this.actualizandoPassword.set(true);
    this.usuarioService.cambiarPassword(this.password).subscribe({
      next: () => {
        this.password = { passwordActual: '', passwordNueva: '', confirmarPassword: '' };
        this.mensajeExitoPassword.set('Tu contraseña se actualizó correctamente.');
        this.actualizandoPassword.set(false);
      },
      error: (error) => {
        const mensaje = this.obtenerMensajeError(error, 'No fue posible actualizar la contraseña.');
        this.erroresPassword['general'] = mensaje;
        if (mensaje.toLowerCase().includes('actual')) this.erroresPassword['passwordActual'] = mensaje;
        if (mensaje.toLowerCase().includes('confirmación') || mensaje.toLowerCase().includes('coinciden')) {
          this.erroresPassword['confirmarPassword'] = mensaje;
          delete this.erroresPassword['general'];
        }
        this.actualizandoPassword.set(false);
      },
    });
  }

  private asignarErrorPerfil(mensaje: string) {
    const texto = mensaje.toLowerCase();
    if (texto.includes('correo')) this.erroresPerfil['email'] = mensaje;
    else if (texto.includes('usuario')) this.erroresPerfil['userName'] = mensaje;
    else this.erroresPerfil['general'] = mensaje;
  }

  private obtenerMensajeError(error: any, predeterminado: string): string {
    return typeof error?.error === 'string'
      ? error.error
      : error?.error?.message || error?.message || predeterminado;
  }

  cargarPedidos() {
    this.cargandoPedidos.set(true);
    this.errorPedidos.set('');
    this.pedidoService.obtenerMisPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos.set(pedidos);
        this.cargandoPedidos.set(false);
      },
      error: () => {
        this.errorPedidos.set('No fue posible obtener tus pedidos. Intenta nuevamente.');
        this.cargandoPedidos.set(false);
      },
    });
  }

  verDetallePedido(id: number) {
    this.router.navigate(['/mis-pedidos', id]);
  }

  estadoPedidoClase(estado: string): string {
    return estado.toLowerCase().replace(/\s+/g, '-');
  }

  usarMiUbicacion() {
    this.errorUbicacion.set('');
    this.mensajeUbicacion.set('');

    if (!navigator.geolocation) {
      this.errorUbicacion.set('Tu navegador no admite geolocalización.');
      return;
    }

    this.obteniendoUbicacion.set(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.nuevaDireccion.latitud = Number(coords.latitude.toFixed(7));
        this.nuevaDireccion.longitud = Number(coords.longitude.toFixed(7));
        this.actualizarMapa(coords.latitude, coords.longitude);
        this.mensajeUbicacion.set('Ubicación encontrada. Estamos completando los datos disponibles.');
        this.completarDireccionDesdeCoordenadas(coords.latitude, coords.longitude);
      },
      (error) => {
        this.obteniendoUbicacion.set(false);
        const mensajes: Record<number, string> = {
          1: 'No se concedió permiso para acceder a tu ubicación.',
          2: 'No fue posible determinar tu ubicación actual.',
          3: 'La solicitud de ubicación tardó demasiado.'
        };
        this.errorUbicacion.set(mensajes[error.code] || 'No fue posible obtener tu ubicación.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  }

  private completarDireccionDesdeCoordenadas(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=es`;
    this.http.get<any>(url).subscribe({
      next: (respuesta) => {
        const a = respuesta?.address ?? {};
        this.nuevaDireccion.calle = a.road || a.pedestrian || a.neighbourhood || this.nuevaDireccion.calle;
        this.nuevaDireccion.colonia = a.suburb || a.neighbourhood || a.quarter || this.nuevaDireccion.colonia;
        this.nuevaDireccion.ciudad = a.city || a.town || a.village || a.municipality || this.nuevaDireccion.ciudad;
        this.nuevaDireccion.estado = a.state || this.nuevaDireccion.estado;
        this.nuevaDireccion.codigoPostal = a.postcode || this.nuevaDireccion.codigoPostal;
        this.mensajeUbicacion.set('Ubicación lista. Revisa y completa número exterior e interior antes de guardar.');
        this.obteniendoUbicacion.set(false);
      },
      error: () => {
        this.mensajeUbicacion.set('Ubicación obtenida. Puedes completar manualmente los datos de la dirección.');
        this.obteniendoUbicacion.set(false);
      },
    });
  }

  private actualizarMapa(lat: number, lon: number) {
    const margen = 0.006;
    const bbox = `${lon - margen}%2C${lat - margen}%2C${lon + margen}%2C${lat + margen}`;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
    this.mapaUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  abrirUbicacion(direccion: Direccion) {
    if (direccion.latitud == null || direccion.longitud == null) return;
    window.open(`https://www.openstreetmap.org/?mlat=${direccion.latitud}&mlon=${direccion.longitud}#map=18/${direccion.latitud}/${direccion.longitud}`, '_blank', 'noopener,noreferrer');
  }

  cargarDirecciones() {
    this.direccionService.obtenerDirecciones().subscribe({
      next: (respuesta) => {
        this.direcciones.set(respuesta);
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  guardarDireccion() {
    if (
      !this.nuevaDireccion.nombreDestinatario ||
      !this.nuevaDireccion.telefonoContacto ||
      !this.nuevaDireccion.calle ||
      !this.nuevaDireccion.numeroExterior ||
      !this.nuevaDireccion.colonia ||
      !this.nuevaDireccion.ciudad ||
      !this.nuevaDireccion.estado ||
      !this.nuevaDireccion.codigoPostal
    ) {
      alert('Completa todos los campos obligatorios.');

      return;
    }

    this.direccionService.crear(this.nuevaDireccion).subscribe({
      next: () => {
        alert('Dirección guardada correctamente.');

        this.cargarDirecciones();

        this.mostrarFormulario.set(false);

        this.nuevaDireccion = {
          id: 0,
          nombreDestinatario: '',
          telefonoContacto: '',
          calle: '',
          numeroExterior: '',
          numeroInterior: '',
          colonia: '',
          ciudad: '',
          estado: '',
          codigoPostal: '',
          referencias: '',
          predeterminada: false,
          latitud: null,
          longitud: null,
        };
      },

      error: (error) => {
        console.error(error);

        alert('No fue posible guardar la dirección.');
      },
    });
  }

  editarDireccion(direccion: Direccion) {
    this.modoEdicion.set(true);
    this.mostrarFormulario.set(true);
    this.direccionEditarId.set(direccion.id);
    this.nuevaDireccion = { ...direccion };
    if (direccion.latitud != null && direccion.longitud != null) {
      this.actualizarMapa(direccion.latitud, direccion.longitud);
    } else {
      this.mapaUrl.set(null);
    }
  }

  actualizarDireccion() {
    const id = this.direccionEditarId();

    if (id == null) return;

    this.direccionService.actualizar(id, this.nuevaDireccion).subscribe({
      next: () => {
        alert('Dirección actualizada correctamente.');
        this.cargarDirecciones();
        this.cancelarFormulario();
      },

      error: (error) => {
        console.error(error);
        alert('No fue posible actualizar la dirección.');
      },
    });
  }

  eliminarDireccion(id: number) {
    if (!confirm('¿Deseas eliminar esta dirección?')) {
      return;
    }

    this.direccionService.eliminar(id).subscribe({
      next: () => {
        this.cargarDirecciones();
      },

      error: (error) => {
        console.error(error);

        alert('No fue posible eliminar la dirección.');
      },
    });
  }

  hacerPredeterminada(id: number) {
    this.direccionService.establecerPredeterminada(id).subscribe({
      next: () => {
        this.cargarDirecciones();
      },

      error: (error) => {
        console.error(error);
        alert('No fue posible actualizar la dirección predeterminada.');
      },
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario.set(false);
    this.mapaUrl.set(null);
    this.mensajeUbicacion.set('');
    this.errorUbicacion.set('');
    this.modoEdicion.set(false);
    this.direccionEditarId.set(null);
    this.nuevaDireccion = {
      id: 0,
      nombreDestinatario: '',
      telefonoContacto: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      colonia: '',
      ciudad: '',
      estado: '',
      codigoPostal: '',
      referencias: '',
      predeterminada: false,
      latitud: null,
      longitud: null,
    };
  }
}
